// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var buf2hex = require('./buf2hex');
var Response = require('./Response');
var ResponseMode = require('./ResponseMode');
var ResponseTimeoutError = require('./ResponseTimeoutError');

module.exports = Request;

/**
 * @constructor
 * @param {number} address
 * @param {number} id
 * @param {Order} order
 * @param {function((Error|null), (Response|null))} responseHandler
 */
function Request(address, id, order, responseHandler)
{
  /**
   * @type {number}
   */
  this.address = address;

  /**
   * @type {number}
   */
  this.id = id;

  /**
   * @type {string}
   */
  this.code = order.code;

  /**
   * @type {Buffer}
   */
  this.data = order.encodeData();

  /**
   * @type {Buffer|null}
   */
  this.frame = null;

  /**
   * @private
   * @type {Order}
   */
  this.order = order;

  /**
   * @private
   * @type {function((Error|null), (Response|null))} responseHandler
   */
  this.responseHandler = responseHandler;

  /**
   * @private
   * @type {*}
   */
  this.timeoutTimer = null;
}

/**
 * @returns {object}
 */
Request.prototype.inspect = function()
{
  return {
    address: this.address,
    id: this.id,
    code: this.code,
    order: this.order,
    completed: this.responseHandler === null,
    data: buf2hex(this.data),
    dataLength: this.data.length,
    frame: buf2hex(this.frame),
    frameLength: this.frame === null ? 0 : this.frame.length
  };
};

/**
 * @param {ResponseMode} responseMode
 * @param {ResponseStatus} status
 * @param {Buffer} data
 * @returns {Response}
 */
Request.prototype.createResponse = function(responseMode, status, data)
{
  if (status.busy
    || status.lastTaskError
    || status.badOrder
    || status.badData
    || status.indirectOrder
    || status.accessDenied)
  {
    return new Response(this.address, this.id, this.code, status, data);
  }

  return responseMode === ResponseMode.DIRECT
    ? this.order.createDirectResponse(this.address, this.id, status, data)
    : this.order.createIndirectResponse(this.address, this.id, status, data);
};

/**
 * @param {number} delay
 */
Request.prototype.setTimeout = function(delay)
{
  this.clearTimeout();

  this.timeoutTimer = setTimeout(this.handleTimeout.bind(this), Math.max(5, delay));
};

Request.prototype.clearTimeout = function()
{
  if (this.timeoutTimer !== null)
  {
    clearTimeout(this.timeoutTimer);
    this.timeoutTimer = null;
  }
};

/**
 * @returns {boolean}
 */
Request.prototype.isCompleted = function()
{
  return this.responseHandler === null;
};

/**
 * @param {Error|null} error
 * @param {(Response|null)} response
 */
Request.prototype.handleResponse = function(error, response)
{
  this.clearTimeout();

  if (this.isCompleted())
  {
    return;
  }

  var handleResponse = this.responseHandler;

  this.responseHandler = null;

  handleResponse(error, response);
};

/**
 * @private
 */
Request.prototype.handleTimeout = function()
{
  this.handleResponse(new ResponseTimeoutError(this), null);
};
