// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');

module.exports = SetResetFlag;

/**
 * @constructor
 * @extends {Order}
 */
function SetResetFlag()
{
  Order.call(this, 'E');
}

inherits(SetResetFlag, Order);
