// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var GetNameAndNumberResponse = require('./GetNameAndNumberResponse');

module.exports = GetNameAndNumber;

/**
 * @constructor
 * @extends {Order}
 */
function GetNameAndNumber()
{
  Order.call(this, 'o', GetNameAndNumberResponse);
}

inherits(GetNameAndNumber, Order);
