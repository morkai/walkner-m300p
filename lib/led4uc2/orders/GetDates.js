// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var GetDatesResponse = require('./GetDatesResponse');

module.exports = GetDates;

/**
 * @constructor
 * @extends {Order}
 */
function GetDates()
{
  Order.call(this, 's', GetDatesResponse);
}

inherits(GetDates, Order);

