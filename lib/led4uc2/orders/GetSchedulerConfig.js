// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var DailySchedule = require('../DailySchedule');
var GetSchedulerConfigResponse = require('./GetSchedulerConfigResponse');

module.exports = GetSchedulerConfig;

/**
 * @constructor
 * @extends {Order}
 * @param {DailySchedule.Day|string} day
 */
function GetSchedulerConfig(day)
{
  Order.call(this, 'x', null, GetSchedulerConfigResponse);

  /**
   * @type {DailySchedule.Day}
   */
  this.day = typeof day === 'string' ? DailySchedule.Day[day.toUpperCase()] : day;
}

inherits(GetSchedulerConfig, Order);

/**
 * @returns {object}
 */
GetSchedulerConfig.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.day = DailySchedule.Day.toString(this.day);

  return obj;
};

/**
 * @returns {Buffer}
 */
GetSchedulerConfig.prototype.encodeData = function()
{
  return new Buffer([
    this.day
  ]);
};
