// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var DailySchedule = require('../DailySchedule');
var Response = require('../Response');

var EMPTY_DAILY_SCHEDULE = new DailySchedule(0, 0, DailySchedule.Func.NULL, 50);

module.exports = SetSchedulerConfig;

/**
 * @constructor
 * @extends {Order}
 * @param {DailySchedule.Day} day
 * @param {Array.<DailySchedule>} schedule
 */
function SetSchedulerConfig(day, schedule)
{
  Order.call(this, 'X', null, Response);

  if (DailySchedule.Day.toString(day) === null)
  {
    throw new Error(
      'The `SetSchedulerConfig.day` must be one of the following `DailySchedule.Day` values: '
      + Object.keys(DailySchedule.Day).join(', ') + '.'
    );
  }

  if (!Array.isArray(schedule)
    || schedule.length !== 8
    || schedule.some(function(v) { return !(v instanceof DailySchedule); }))
  {
    throw new Error('The `SetSchedulerConfig.schedule` must be a array of 8 `DailySchedule` instances.');
  }

  /**
   * @type {DailySchedule.Day}
   */
  this.day = day;

  /**
   * @type {Array.<DailySchedule>}
   */
  this.schedule = schedule;
}

inherits(SetSchedulerConfig, Order);

/**
 * @param {object} obj
 * @param {number|string} obj.day
 * @param {Array.<{hours: number, minutes: number, func: (number|string), level: number}>} obj.schedule
 * @returns {SetSchedulerConfig}
 * @throws {Error} If any property is invalid.
 */
SetSchedulerConfig.fromObject = function(obj)
{
  if (!Array.isArray(obj.schedule))
  {
    throw new Error('The `SetSchedulerConfig.fromObject.schedule` must be an array.');
  }

  return new SetSchedulerConfig(
    typeof obj.day === 'string' ? DailySchedule.Day[obj.day.toUpperCase()] : obj.day,
    obj.schedule.map(DailySchedule.fromObject)
  );
};

/**
 * @returns {object}
 */
SetSchedulerConfig.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.day = DailySchedule.Day.toString(this.day);
  obj.schedule = this.schedule;

  return obj;
};

/**
 * @returns {Buffer}
 */
SetSchedulerConfig.prototype.encodeData = function()
{
  var dataBuffer = new Buffer(33);

  dataBuffer[0] = this.day;

  for (var scheduleI = 0, byteI = 0; scheduleI < 8; ++scheduleI)
  {
    var dailySchedule = this.schedule[scheduleI] || EMPTY_DAILY_SCHEDULE;

    dataBuffer[++byteI] = dailySchedule.hours;
    dataBuffer[++byteI] = dailySchedule.minutes;
    dataBuffer[++byteI] = dailySchedule.func;
    dataBuffer[++byteI] = dailySchedule.level;
  }

  return dataBuffer;
};
