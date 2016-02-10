// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var BufferReader = require('h5.buffers').BufferReader;
var shiftDate = require('../shiftDate');
var Response = require('../Response');

module.exports = GetDatesResponse;

/**
 * @constructor
 * @extends {Response}
 * @param {number} address
 * @param {number} requestId
 * @param {string} code
 * @param {ResponseStatus} status
 * @param {Buffer} data
 */
function GetDatesResponse(address, requestId, code, status, data)
{
  Response.apply(this, arguments);

  var dataReader = new BufferReader(data);

  /**
   * @type {Date}
   */
  this.maintenance = shiftDate(dataReader);

  /**
   * @type {Date}
   */
  this.installation = shiftDate(dataReader);

  /**
   * @type {Date}
   */
  this.configuration = shiftDate(dataReader);

  /**
   * @type {Date}
   */
  this.error = shiftDate(dataReader);
}

inherits(GetDatesResponse, Response);

/**
 * @returns {object}
 */
GetDatesResponse.prototype.inspect = function()
{
  var obj = Response.prototype.inspect.call(this);

  obj.maintenance = this.maintenance.toISOString();
  obj.installation = this.installation.toISOString();
  obj.configuration = this.configuration.toISOString();
  obj.error = this.error.toISOString();

  return obj;
};
