// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');

module.exports = SetBlinkingWarning;

/**
 * @constructor
 * @extends {Order}
 */
function SetBlinkingWarning()
{
  Order.call(this, 'G');
}

inherits(SetBlinkingWarning, Order);
