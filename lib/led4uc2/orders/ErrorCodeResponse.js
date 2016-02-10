// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Response = require('../Response');
var OrderError = require('../OrderError');

module.exports = ErrorCodeResponse;

/**
 * @constructor
 * @extends {Response}
 * @param {number} address
 * @param {number} requestId
 * @param {string} code
 * @param {ResponseStatus} status
 * @param {Buffer} data
 */
function ErrorCodeResponse(address, requestId, code, status, data)
{
  Response.apply(this, arguments);

  /**
   * @type {number}
   */
  this.errorCode = data.length === 0
    ? 0
    : data.length === 1
      ? data[0]
      : data.readUInt16LE(0);
}

inherits(ErrorCodeResponse, Response);

/**
 * @returns {object}
 */
ErrorCodeResponse.prototype.inspect = function()
{
  var obj = Response.prototype.inspect.call(this);

  obj.errorCode = this.errorCode;

  return obj;
};

ErrorCodeResponse.prototype.createOrderError = function()
{
  return new OrderError(null, this);
};
