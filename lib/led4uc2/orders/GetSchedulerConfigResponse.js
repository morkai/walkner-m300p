// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var BufferReader = require('h5.buffers').BufferReader;
var Response = require('../Response');
var DailySchedule = require('../DailySchedule');

module.exports = GetSchedulerConfigResponse;

/**
 * @constructor
 * @extends {Response}
 * @param {number} address
 * @param {number} requestId
 * @param {string} code
 * @param {ResponseStatus} status
 * @param {Buffer} data
 */
function GetSchedulerConfigResponse(address, requestId, code, status, data)
{
  Response.apply(this, arguments);

  var dataReader = new BufferReader(data);

  // Last order code + error code
  dataReader.skip(3);

  /**
   * @type {DailySchedule.Day}
   */
  this.day = dataReader.shiftByte();

  /**
   * @type {Array.<DailySchedule>}
   */
  this.schedule = [];

  while (dataReader.length > 0)
  {
    this.schedule.push(DailySchedule.fromBufferReader(dataReader));
  }
}

inherits(GetSchedulerConfigResponse, Response);

/**
 * @returns {object}
 */
GetSchedulerConfigResponse.prototype.inspect = function()
{
  var obj = Response.prototype.inspect.call(this);

  obj.day = DailySchedule.Day.toString(this.day);
  obj.schedule = this.schedule;

  return obj;
};
