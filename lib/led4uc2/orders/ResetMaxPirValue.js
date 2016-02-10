// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');

module.exports = ResetMaxPirValue;

/**
 * @constructor
 * @extends {Order}
 */
function ResetMaxPirValue()
{
  Order.call(this, '*');
}

inherits(ResetMaxPirValue, Order);
