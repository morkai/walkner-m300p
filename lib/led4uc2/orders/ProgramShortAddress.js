// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');

module.exports = ProgramShortAddress;

/**
 * @constructor
 * @extends {Order}
 * @param {number} lampCount 1-7
 */
function ProgramShortAddress(lampCount)
{
  Order.call(this, 'D');

  /**
   * @type {number}
   */
  this.lampCount = lampCount;
}

inherits(ProgramShortAddress, Order);

/**
 * @returns {object}
 */
ProgramShortAddress.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.lampCount = this.lampCount;

  return obj;
};

/**
 * @returns {Buffer}
 */
ProgramShortAddress.prototype.encodeData = function()
{
  return new Buffer([
    this.lampCount
  ]);
};
