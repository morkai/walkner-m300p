// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var GetInfoResponse = require('./GetInfoResponse');

module.exports = GetInfo;

/**
 * @constructor
 * @extends {Order}
 */
function GetInfo()
{
  Order.call(this, 'b', GetInfoResponse);
}

inherits(GetInfo, Order);

