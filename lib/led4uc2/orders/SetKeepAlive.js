// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');

module.exports = SetKeepAlive;

/**
 * @constructor
 * @extends {Order}
 * @param {number} syncValue
 */
function SetKeepAlive(syncValue)
{
  Order.call(this, 'K');

  /**
   * @type {number}
   */
  this.syncValue = syncValue;
}

inherits(SetKeepAlive, Order);

/**
 * @returns {object}
 */
SetKeepAlive.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.syncValue = this.syncValue;

  return obj;
};

/**
 * @returns {Buffer}
 */
SetKeepAlive.prototype.encodeData = function()
{
  return new Buffer([
    this.syncValue
  ]);
};
