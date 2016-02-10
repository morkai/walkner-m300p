// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');

module.exports = SetBlinking;

/**
 * @constructor
 * @extends {Order}
 * @param {number} timeOn
 * @param {number} timeOff
 * @param {number} pulseCount
 */
function SetBlinking(timeOn, timeOff, pulseCount)
{
  Order.call(this, 'N');

  /**
   * @type {number}
   */
  this.timeOn = timeOn;

  /**
   * @type {number}
   */
  this.timeOff = timeOff;

  /**
   * @type {number}
   */
  this.pulseCount = pulseCount;
}

inherits(SetBlinking, Order);

/**
 * @returns {object}
 */
SetBlinking.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.timeOn = this.timeOn;
  obj.timeOff = this.timeOff;
  obj.pulseCount = this.pulseCount;

  return obj;
};

/**
 * @returns {Buffer}
 */
SetBlinking.prototype.encodeData = function()
{
  return new Buffer([
    Math.round(this.timeOn * 10),
    Math.round(this.timeOff * 10),
    this.pulseCount
  ]);
};
