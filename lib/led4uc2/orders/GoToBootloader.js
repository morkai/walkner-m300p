// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');

module.exports = GoToBootloader;

/**
 * @constructor
 * @extends {Order}
 * @param {number} maxWaitTime uint8
 */
function GoToBootloader(maxWaitTime)
{
  Order.call(this, '7');

  /**
   * @type {number}
   */
  this.maxWaitTime = maxWaitTime;
}

inherits(GoToBootloader, Order);

/**
 * @returns {object}
 */
GoToBootloader.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.maxWaitTime = this.maxWaitTime;

  return obj;
};

/**
 * @returns {Buffer}
 */
GoToBootloader.prototype.encodeData = function()
{
  return new Buffer([
    this.maxWaitTime
  ]);
};
