// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var GetStatusResponse = require('./GetStatusResponse');

module.exports = GetStatus;

/**
 * @constructor
 * @extends {Order}
 */
function GetStatus()
{
  Order.call(this, 'e', GetStatusResponse);
}

inherits(GetStatus, Order);
