// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');

module.exports = SetSelectionPulse;

/**
 * @constructor
 * @extends {Order}
 * @param {boolean} lampOnOff
 * @param {number} onTime
 * @param {number} offTime
 * @param {number} num
 * @param {number} period
 * @param {number} highLevel
 * @param {number} lowLevel
 */
function SetSelectionPulse(lampOnOff, onTime, offTime, num, period, highLevel, lowLevel)
{
  Order.call(this, 'U');

  /**
   * @type {boolean}
   */
  this.lampOnOff = lampOnOff;

  /**
   * @type {number}
   */
  this.onTime = onTime;

  /**
   * @type {number}
   */
  this.offTime = offTime;

  /**
   * @type {number}
   */
  this.num = num;

  /**
   * @type {number}
   */
  this.period = period;

  /**
   * @type {number}
   */
  this.highLevel = highLevel;

  /**
   * @type {number}
   */
  this.lowLevel = lowLevel;
}

inherits(SetSelectionPulse, Order);

/**
 * @returns {object}
 */
SetSelectionPulse.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.lampOnOff = this.lampOnOff;
  obj.onTime = this.onTime;
  obj.offTime = this.offTime;
  obj.num = this.num;
  obj.period = this.period;
  obj.highLevel = this.highLevel;
  obj.lowLevel = this.lowLevel;

  return obj;
};

/**
 * @returns {Buffer}
 */
SetSelectionPulse.prototype.encodeData = function()
{
  var dataBuffer = new Buffer(10);

  dataBuffer[0] = this.lampOnOff ? 1 : 0;
  dataBuffer.writeUInt8(Math.round(this.onTime * 10), 1);
  dataBuffer.writeUInt8(Math.round(this.offTime * 10), 2);
  dataBuffer[3] = this.num;
  dataBuffer.writeUInt16LE(Math.round(this.period * 10), 4);
  dataBuffer.writeUInt16LE(Math.round(this.highLevel * 10), 6);
  dataBuffer.writeUInt16LE(Math.round(this.lowLevel * 10), 8);

  return dataBuffer;
};
