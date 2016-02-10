// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var GetRtcResponse = require('./GetRtcResponse');

module.exports = GetRtc;

/**
 * @constructor
 * @extends {Order}
 */
function GetRtc()
{
  Order.call(this, 'r', GetRtcResponse);
}

inherits(GetRtc, Order);
