// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');

module.exports = SetRtc;

/**
 * @constructor
 * @extends {Order}
 * @param {Date} date
 * @param {boolean} autoDst
 */
function SetRtc(date, autoDst)
{
  Order.call(this, 'R');

  /**
   * @type {Date}
   */
  this.date = date;

  /**
   * @type {boolean}
   */
  this.autoDst = autoDst;
}

inherits(SetRtc, Order);

/**
 * @returns {object}
 */
SetRtc.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.date = this.date.toISOString();
  obj.autoDst = this.autoDst;

  return obj;
};

/**
 * @returns {Buffer}
 */
SetRtc.prototype.encodeData = function()
{
  var data = new Buffer([
    this.date.getSeconds(),
    this.date.getMinutes(),
    this.date.getHours(),
    this.date.getDate(),
    this.date.getMonth() + 1,
    0,
    this.autoDst ? 1 : 0
  ]);

  data.writeInt8(this.date.getFullYear() - 2000, 5);

  return data;
};
