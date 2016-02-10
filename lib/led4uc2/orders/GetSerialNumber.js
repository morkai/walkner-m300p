// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var TextResponse = require('./TextResponse');

module.exports = GetSerialNumber;

/**
 * @constructor
 * @extends {Order}
 */
function GetSerialNumber()
{
  Order.call(this, 'z', TextResponse);
}

inherits(GetSerialNumber, Order);

