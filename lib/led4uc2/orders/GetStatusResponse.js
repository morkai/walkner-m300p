// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var BufferReader = require('h5.buffers').BufferReader;
var Response = require('../Response');
var Status = require('../Status');

module.exports = GetStatusResponse;

/**
 * @constructor
 * @extends {Response}
 * @param {number} address
 * @param {number} requestId
 * @param {string} code
 * @param {ResponseStatus} status
 * @param {Buffer} data
 */
function GetStatusResponse(address, requestId, code, status, data)
{
  Response.apply(this, arguments);

  /**
   * @type {Status}
   */
  this.status = Status.fromBufferReader(new BufferReader(data));
}

inherits(GetStatusResponse, Response);

/**
 * @returns {object}
 */
GetStatusResponse.prototype.inspect = function()
{
  var obj = Response.prototype.inspect.call(this);

  obj.status = this.status;

  return obj;
};
