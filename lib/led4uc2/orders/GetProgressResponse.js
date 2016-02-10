// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Response = require('../Response');
var OrderError = require('../OrderError');

module.exports = GetProgressResponse;

/**
 * @constructor
 * @extends {Response}
 * @param {number} address
 * @param {number} requestId
 * @param {string} code
 * @param {ResponseStatus} status
 * @param {Buffer} data
 */
function GetProgressResponse(address, requestId, code, status, data)
{
  Response.apply(this, arguments);

  /**
   * @type {number}
   */
  this.progress = data.readUInt16LE(0) / 10;

  /**
   * @type {number}
   */
  this.errorCode = data.readUInt16LE(2);

  /**
   * @type {PreviewStep|number}
   */
  this.value = data[4];
}

inherits(GetProgressResponse, Response);

/**
 * @returns {object}
 */
GetProgressResponse.prototype.inspect = function()
{
  var obj = Response.prototype.inspect.call(this);

  obj.progress = this.progress;
  obj.errorCode = this.errorCode;
  obj.value = this.value;

  return obj;
};

/**
 * @returns {OrderError}
 */
GetProgressResponse.prototype.createOrderError = function()
{
  return new OrderError(null, this);
};
