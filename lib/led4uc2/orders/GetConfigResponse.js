// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var BufferReader = require('h5.buffers').BufferReader;
var Response = require('../Response');
var Config = require('../Config');

module.exports = GetConfigResponse;

/**
 * @constructor
 * @extends {Response}
 * @param {number} address
 * @param {number} requestId
 * @param {string} code
 * @param {ResponseStatus} status
 * @param {Buffer} data
 */
function GetConfigResponse(address, requestId, code, status, data)
{
  Response.apply(this, arguments);

  /**
   * @type {Config}
   */
  this.config = Config.fromBufferReader(new BufferReader(data));
}

inherits(GetConfigResponse, Response);

/**
 * @returns {object}
 */
GetConfigResponse.prototype.inspect = function()
{
  var obj = Response.prototype.inspect.call(this);

  obj.config = this.config;

  return obj;
};
