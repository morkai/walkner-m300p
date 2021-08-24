// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var buffers = require('h5.buffers');
var Request = require('./Request');
var ResponseStatus = require('./ResponseStatus');
var ResponseMode = require('./ResponseMode');
var GetTaskBuffer = require('./orders/GetTaskBuffer');
var GetTaskBufferResponse = require('./orders/GetTaskBufferResponse');
var AccessDeniedError = require('./AccessDeniedError');
var BadDataError = require('./BadDataError');
var BadOrderError = require('./BadOrderError');
var OrderError = require('./OrderError');
var ResponseTimeoutError = require('./ResponseTimeoutError');
var DataIgnoredEventArgs = require('./DataIgnoredEventArgs');

module.exports = Transport;

var STX = 0x02;
var ETX = 0x03;
var DLE = 0x10;

/**
 * @constructor
 * @extends {EventEmitter}
 * @param {Connection} connection
 * @param {object} [options]
 * @param {number} [options.address]
 * @param {number} [options.responseTimeoutDelay]
 * @param {number} [options.indirectRequestDelay]
 */
function Transport(connection, options)
{
  EventEmitter.call(this);

  if (!options)
  {
    options = {};
  }

  /**
   * @type {Connection}
   */
  this.connection = connection;
  this.connection.on('data', this.onData.bind(this));

  /**
   * @private
   * @type {number}
   */
  this.address = options.address || 0;

  /**
   * @private
   * @type {number}
   */
  this.responseTimeoutDelay = options.responseTimeoutDelay || 100;

  /**
   * @private
   * @type {number}
   */
  this.indirectRequestDelay = options.indirectRequestDelay || 5;

  /**
   * @private
   * @type {number}
   */
  this.sendOrderDelay = options.sendOrderDelay || 200;

  /**
   * @private
   * @type {number}
   */
  this.maxRetryCount = options.maxRetryCount || 3;

  /**
   * @private
   * @type {Request|null}
   */
  this.request = null;

  /**
   * @private
   * @type {Request|null}
   */
  this.indirectRequest = null;

  /**
   * @private
   * @type {number}
   */
  this.requestIdCounter = Math.round(Math.random() * 255);

  /**
   * @private
   * @type {*}
   */
  this.indirectRequestTimer = null;

  /**
   * @private
   * @type {*}
   */
  this.sendOrderTimer = null;

  /**
   * @private
   * @type {BufferQueueReader}
   */
  this.reader = new buffers.BufferQueueReader();
}

util.inherits(Transport, EventEmitter);

Transport.prototype.destroy = function()
{
  this.removeAllListeners();
  this.connection.destroy();
  this.connection = null;
  this.request = null;
  this.indirectRequest = null;
  this.reader = null;

  if (this.indirectRequestTimer !== null)
  {
    clearTimeout(this.indirectRequestTimer);
    this.indirectRequestTimer = null;
  }

  if (this.sendOrderTimer !== null)
  {
    clearTimeout(this.indirectRequestTimer);
    this.indirectRequestTimer = null;
  }
};

/**
 * @returns {boolean}
 */
Transport.prototype.isRequesting = function()
{
  return this.request !== null || this.indirectRequest !== null;
};

/**
 * @param {Order} order
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Transport.prototype.send = function(order, responseHandler)
{
  if (this.isRequesting())
  {
    setImmediate(responseHandler, new Error('Another request is already in progress.'), null);

    return;
  }

  this.sendOrderTimer = setTimeout(
    this.sendOrder.bind(this),
    this.sendOrderDelay,
    0,
    order,
    responseHandler
  );
};

/**
 * @private
 * @param {number} tryNo
 * @param {Order} order
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Transport.prototype.sendOrder = function(tryNo, order, responseHandler)
{
  this.indirectRequestTimer = null;
  this.sendOrderTimer = null;

  this.request = new Request(
    this.address,
    this.generateNextRequestId(),
    order,
    this.retryOrder.bind(this, tryNo, order, responseHandler)
  );

  this.request.frame = this.encodeFrame(
    this.request.address,
    this.request.id,
    this.request.code.charCodeAt(0),
    this.request.data
  );

  this.emit('request', this.request, tryNo);

  this.connection.write(this.request.frame);

  this.request.setTimeout(this.responseTimeoutDelay);
};

/**
 * @private
 * @param {number} tryNo
 * @param {Order} order
 * @param {function((Error|null), (Response|null))} responseHandler
 * @param {Error|null} error
 * @param {Response|null} response
 */
Transport.prototype.retryOrder = function(tryNo, order, responseHandler, error, response)
{
  if (!error || tryNo >= this.maxRetryCount)
  {
    return responseHandler(error, response);
  }

  this.sendOrderTimer = setTimeout(
    this.sendOrder.bind(this),
    this.sendOrderDelay,
    tryNo + 1,
    order,
    responseHandler
  );
};

/**
 * @private
 * @param {Buffer} buffer
 * @returns {Buffer}
 */
Transport.prototype.decodeFrame = function(buffer)
{
  var builder = new buffers.BufferBuilder();

  for (var i = 0, l = buffer.length; i < l; ++i)
  {
    var b = buffer[i];

    if (b === DLE)
    {
      builder.pushByte(buffer[++i] - DLE);
    }
    else
    {
      builder.pushByte(b);
    }
  }

  return builder.toBuffer();
};

/**
 * @private
 * @param {number} address
 * @param {number} requestId
 * @param {number} code
 * @param {Buffer} data
 * @returns {Buffer}
 */
Transport.prototype.encodeFrame = function(address, requestId, code, data)
{
  var pduBuilder = new buffers.BufferBuilder();

  pduBuilder.pushBytes([address, requestId, code, 0, data.length]);
  pduBuilder.pushBuffer(data);
  pduBuilder.pushByte(0);

  var pduBuffer = pduBuilder.toBuffer();
  var pduLength = pduBuffer.length;

  pduBuffer[pduLength - 1] = this.generateChecksum(pduBuffer, 0, pduLength - 1);

  var frameBuilder = new buffers.BufferBuilder();

  frameBuilder.pushByte(STX);

  for (var i = 0; i < pduLength; ++i)
  {
    var b = pduBuffer[i];

    if (b === STX)
    {
      frameBuilder.pushByte(DLE).pushByte(DLE + STX);
    }
    else if (b === ETX)
    {
      frameBuilder.pushByte(DLE).pushByte(DLE + ETX);
    }
    else if (b === DLE)
    {
      frameBuilder.pushByte(DLE).pushByte(DLE + DLE);
    }
    else
    {
      frameBuilder.pushByte(b);
    }
  }

  frameBuilder.pushByte(ETX);

  return frameBuilder.toBuffer();
};

/**
 * @private
 * @returns {number}
 */
Transport.prototype.generateNextRequestId = function()
{
  if (this.requestIdCounter === 255)
  {
    this.requestIdCounter = 0;
  }

  ++this.requestIdCounter;

  return this.requestIdCounter;
};

/**
 * @private
 * @param {Buffer} bytes
 * @param {number} [i]
 * @param {number} [l]
 * @returns {number}
 */
Transport.prototype.generateChecksum = function(bytes, i, l)
{
  if (i == null)
  {
    i = 0;
  }

  if (l == null)
  {
    l = bytes.length;
  }

  var checksum = 0;

  while (i < l)
  {
    checksum ^= bytes[i++];
  }

  return checksum;
};

/**
 * @private
 * @param {Buffer} data
 */
Transport.prototype.onData = function(data)
{
  if (this.request === null)
  {
    this.emit('dataIgnored', new DataIgnoredEventArgs('NO_REQUEST', data));

    return;
  }

  var newFrame = data[0] === STX;
  var readerLength = this.reader.length;

  if (!newFrame && readerLength === 0)
  {
    this.emit('dataIgnored', new DataIgnoredEventArgs('NO_STX', data));

    return;
  }

  if (newFrame && readerLength > 0)
  {
    this.emit('dataIgnored', new DataIgnoredEventArgs('NEW_FRAME', this.reader.shiftBuffer(readerLength)));
  }

  this.reader.push(data);

  if (data[data.length - 1] === ETX)
  {
    this.handleFrame();
  }
};

/**
 * @private
 */
Transport.prototype.handleFrame = function()
{
  var requiredReaderLength = 8;
  var actualReaderLength = this.reader.length;

  if (actualReaderLength < requiredReaderLength)
  {
    this.emit('dataIgnored', new DataIgnoredEventArgs(
      'TOO_SHORT_ENCODED',
      this.reader.shiftBuffer(this.reader.length),
      null,
      requiredReaderLength,
      actualReaderLength
    ));

    return;
  }

  // STX
  this.reader.shiftByte();

  var pduBuffer = this.decodeFrame(this.reader.shiftBuffer(this.reader.length - 1));

  // ETX
  this.reader.shiftByte();

  var requiredPduBufferLength = 6;
  var actualPduBufferLength = pduBuffer.length;

  if (actualPduBufferLength < requiredPduBufferLength)
  {
    this.emit('dataIgnored', new DataIgnoredEventArgs(
      'TOO_SHORT_DECODED', pduBuffer, null, requiredPduBufferLength, actualPduBufferLength
    ));

    return;
  }

  var checksumIndex = pduBuffer.length - 1;
  var requiredChecksum = pduBuffer[checksumIndex];
  var actualChecksum = this.generateChecksum(pduBuffer, 0, checksumIndex);

  if (actualChecksum !== requiredChecksum)
  {
    this.emit('dataIgnored', new DataIgnoredEventArgs(
      'CHECKSUM_MISMATCH', pduBuffer, null, requiredChecksum, actualChecksum
    ));

    return;
  }

  var pduBufferNoChecksum = pduBuffer.slice(0, checksumIndex);
  var pduReader = new buffers.BufferReader(pduBufferNoChecksum);
  var address = pduReader.shiftByte();

  if (address !== this.request.address)
  {
    this.emit('dataIgnored', new DataIgnoredEventArgs(
      'ADDRESS_MISMATCH', pduBuffer, null, this.request.address, address
    ));

    return;
  }

  var requestId = pduReader.shiftByte();

  if (requestId !== this.request.id)
  {
    this.emit('dataIgnored', new DataIgnoredEventArgs(
      'REQUEST_ID_MISMATCH', pduBuffer, null, this.request.id, requestId
    ));

    return;
  }

  var code = String.fromCharCode(pduReader.shiftByte());

  if (code !== this.request.code)
  {
    this.emit('dataIgnored', new DataIgnoredEventArgs(
      'CODE_MISMATCH', pduBuffer, null, this.request.code, code
    ));

    return;
  }

  var responseStatus = ResponseStatus.fromArray(pduReader.shiftBits(8));
  var dataLength = pduReader.shiftByte();

  if (pduReader.length !== dataLength)
  {
    this.emit('dataIgnored', new DataIgnoredEventArgs(
      'MISSING_DATA', pduBuffer, responseStatus, dataLength, pduReader.length
    ));

    return;
  }

  var data = pduReader.length === 0 ? new Buffer(0) : pduReader.shiftBuffer(pduReader.length);
  var response = this.createResponse(ResponseMode.DIRECT, pduBuffer, responseStatus, data);

  if (response !== null)
  {
    this.handleDirectResponse(response);
  }
};

/**
 * @private
 * @param {ResponseMode} responseMode
 * @param {Buffer} pduBuffer
 * @param {ResponseStatus} responseStatus
 * @param {Buffer} data
 * @returns {(Response|null)}
 */
Transport.prototype.createResponse = function(responseMode, pduBuffer, responseStatus, data)
{
  var response = null;

  try
  {
    response = this.request.createResponse(responseMode, responseStatus, data);
  }
  catch (err)
  {
    this.emit('dataIgnored', new DataIgnoredEventArgs(
      'INVALID_RESPONSE', pduBuffer, responseStatus, null, err.stack
    ));
  }

  return response;
};

/**
 * @private
 * @param {Response} response
 */
Transport.prototype.handleDirectResponse = function(response)
{
  var request = this.request;

  this.request = null;

  this.emit('response', request, response);

  if (request.isCompleted())
  {
    return;
  }

  if (response.status.busy || response.status.lastTaskError || response.status.indirectOrder)
  {
    this.getIndirectResponse(request);

    return;
  }

  if (response.status.badOrder)
  {
    request.handleResponse(new BadOrderError(request, response), null);

    return;
  }

  if (response.status.badData)
  {
    request.handleResponse(new BadDataError(request, response), null);

    return;
  }

  if (response.status.accessDenied)
  {
    request.handleResponse(new AccessDeniedError(request, response), null);

    return;
  }

  if (response instanceof GetTaskBufferResponse && response.errorCode !== 0)
  {
    request.handleResponse(new OrderError(request, response), null);

    return;
  }

  request.handleResponse(null, response);
};

/**
 * @private
 * @param {Request} request
 */
Transport.prototype.getIndirectResponse = function(request)
{
  request.clearTimeout();

  if (this.indirectRequest === null)
  {
    this.indirectRequest = request;
  }

  this.indirectRequestTimer = setTimeout(
    this.sendOrder.bind(this),
    this.indirectRequestDelay,
    0,
    new GetTaskBuffer(),
    this.handleIndirectResponse.bind(this)
  );
};

/**
 * @private
 * @param {(Error|null)} error
 * @param {(GetTaskBufferResponse|null)} indirectResponse
 */
Transport.prototype.handleIndirectResponse = function(error, indirectResponse)
{
  var request = this.indirectRequest;

  this.indirectRequest = null;

  if (error)
  {
    request.handleResponse(error, null);

    return;
  }

  this.request = request;

  var response = this.createResponse(
    ResponseMode.INDIRECT,
    indirectResponse.taskBuffer,
    indirectResponse.status,
    indirectResponse.data
  );

  this.request = null;

  this.emit('response', request, response);

  if (response === null)
  {
    request.handleResponse(new ResponseTimeoutError(), null);
  }
  else
  {
    request.handleResponse(null, response);
  }
};
