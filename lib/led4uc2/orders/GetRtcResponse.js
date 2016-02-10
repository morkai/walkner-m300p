// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var BufferReader = require('h5.buffers').BufferReader;
var Response = require('../Response');

module.exports = GetRtcResponse;

/**
 * @constructor
 * @extends {Response}
 * @param {number} address
 * @param {number} requestId
 * @param {string} code
 * @param {ResponseStatus} status
 * @param {Buffer} data
 */
function GetRtcResponse(address, requestId, code, status, data)
{
  Response.apply(this, arguments);

  var dataReader = new BufferReader(data);

  /**
   * @type {number}
   */
  this.seconds = dataReader.shiftUInt8();

  /**
   * @type {number}
   */
  this.minutes = dataReader.shiftUInt8();

  /**
   * @type {number}
   */
  this.hours = dataReader.shiftUInt8();

  /**
   * @type {number}
   */
  this.day = dataReader.shiftUInt8();

  /**
   * @type {number}
   */
  this.month = dataReader.shiftUInt8();

  /**
   * @type {number}
   */
  this.year = 2000 + dataReader.shiftInt8();

  /**
   * @type {boolean}
   */
  this.autoDst = dataReader.shiftByte() === 1;

  /**
   * @type {Date}
   */
  this.date = new Date(this.year, this.month - 1, this.day, this.hours, this.minutes, this.seconds);
}

inherits(GetRtcResponse, Response);

/**
 * @returns {object}
 */
GetRtcResponse.prototype.inspect = function()
{
  var obj = Response.prototype.inspect.call(this);

  obj.autoDst = this.autoDst;
  obj.date = this.date.toISOString();

  return obj;
};
