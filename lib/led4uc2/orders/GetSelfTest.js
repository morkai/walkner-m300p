// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var ErrorCodeResponse = require('./ErrorCodeResponse');

module.exports = GetSelfTest;

/**
 * @constructor
 * @extends {Order}
 */
function GetSelfTest()
{
  Order.call(this, 'f', ErrorCodeResponse);
}

inherits(GetSelfTest, Order);
