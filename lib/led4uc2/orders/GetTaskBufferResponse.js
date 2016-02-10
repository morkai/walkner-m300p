// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var BufferReader = require('h5.buffers').BufferReader;
var buf2hex = require('../buf2hex');
var Response = require('../Response');

module.exports = GetTaskBufferResponse;

/**
 * @constructor
 * @extends {Response}
 * @param {number} address
 * @param {number} requestId
 * @param {string} code
 * @param {ResponseStatus} status
 * @param {Buffer} data
 */
function GetTaskBufferResponse(address, requestId, code, status, data)
{
  Response.apply(this, arguments);

  var dataReader = new BufferReader(data);

  /**
   * @type {string}
   */
  this.lastOrderCode = String.fromCharCode(dataReader.shiftByte());

  /**
   * @type {number}
   */
  this.errorCode = dataReader.shiftUInt16(true);

  /**
   * @type {Buffer}
   */
  this.taskBuffer = dataReader.length === 0 ? new Buffer(0) : dataReader.shiftBuffer(dataReader.length);
}

inherits(GetTaskBufferResponse, Response);

/**
 * @returns {object}
 */
GetTaskBufferResponse.prototype.inspect = function()
{
  var obj = Response.prototype.inspect.call(this);

  obj.lastOrderCode = this.lastOrderCode;
  obj.errorCode = this.errorCode;
  obj.taskBuffer = buf2hex(this.taskBuffer);
  obj.taskBufferLength = this.taskBuffer.length;

  return obj;
};
