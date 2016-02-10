// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Response = require('../Response');

module.exports = GetDriverParametersResponse;

/**
 * @constructor
 * @extends {Response}
 * @param {number} address
 * @param {number} requestId
 * @param {string} code
 * @param {ResponseStatus} status
 * @param {Buffer} data
 */
function GetDriverParametersResponse(address, requestId, code, status, data)
{
  Response.apply(this, arguments);

  /**
   * @type {number}
   */
  this.value = data.readUInt32LE(0);
}

inherits(GetDriverParametersResponse, Response);

/**
 * @returns {object}
 */
GetDriverParametersResponse.prototype.inspect = function()
{
  var obj = Response.prototype.inspect.call(this);

  obj.value = this.value;

  return obj;
};
