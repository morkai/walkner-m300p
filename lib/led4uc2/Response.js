// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var buf2hex = require('./buf2hex');

module.exports = Response;

/**
 * @constructor
 * @param {number} address
 * @param {number} requestId
 * @param {string} code
 * @param {ResponseStatus} status
 * @param {Buffer} data
 */
function Response(address, requestId, code, status, data)
{
  /**
   * @type {number}
   */
  this.address = address;

  /**
   * @type {number}
   */
  this.requestId = requestId;

  /**
   * @type {string}
   */
  this.code = code;

  /**
   * @type {ResponseStatus}
   */
  this.status = status;

  /**
   * @type {Buffer}
   */
  this.data = data;
}

/**
 * @returns {object}
 */
Response.prototype.inspect = function()
{
  return {
    name: this.constructor.name,
    address: this.address,
    requestId: this.requestId,
    code: this.code,
    status: this.status,
    data: buf2hex(this.data),
    dataLength: this.data.length
  };
};
