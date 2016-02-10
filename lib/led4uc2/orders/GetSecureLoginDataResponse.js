// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var buf2hex = require('../buf2hex');
var Response = require('../Response');

module.exports = GetSecureLoginDataResponse;

/**
 * @constructor
 * @extends {Response}
 * @param {number} address
 * @param {number} requestId
 * @param {string} code
 * @param {ResponseStatus} status
 * @param {Buffer} data
 */
function GetSecureLoginDataResponse(address, requestId, code, status, data)
{
  Response.apply(this, arguments);

  /**
   * @type {Buffer}
   */
  this.key = data;
}

inherits(GetSecureLoginDataResponse, Response);

/**
 * @returns {object}
 */
GetSecureLoginDataResponse.prototype.inspect = function()
{
  var obj = Response.prototype.inspect.call(this);

  obj.key = buf2hex(this.key);

  return obj;
};
