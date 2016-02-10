// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Response = require('../Response');

module.exports = GetVersionResponse;

/**
 * @constructor
 * @extends {Response}
 * @param {number} address
 * @param {number} requestId
 * @param {string} code
 * @param {ResponseStatus} status
 * @param {Buffer} data
 */
function GetVersionResponse(address, requestId, code, status, data)
{
  Response.apply(this, arguments);

  /**
   * @type {Config}
   */
  this.program = data.toString('ascii', 0, 4);

  /**
   * @type {string}
   */
  this.version = data.readUInt8(4) + '.' + data.readUInt8(5) + '.' + data.readUInt8(6);
}

inherits(GetVersionResponse, Response);

/**
 * @returns {object}
 */
GetVersionResponse.prototype.inspect = function()
{
  var obj = Response.prototype.inspect.call(this);

  obj.program = this.program;
  obj.version = this.version;

  return obj;
};
