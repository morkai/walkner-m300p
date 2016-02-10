// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var GetBootStatusResponse = require('./GetBootStatusResponse');

module.exports = GetBootStatus;

/**
 * @constructor
 * @extends {Order}
 */
function GetBootStatus()
{
  Order.call(this, '4', GetBootStatusResponse);
}

inherits(GetBootStatus, Order);
