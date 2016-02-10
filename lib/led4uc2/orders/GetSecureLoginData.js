// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var GetSecureLoginDataResponse = require('./GetSecureLoginDataResponse');

module.exports = GetSecureLoginData;

/**
 * @constructor
 * @extends {Order}
 */
function GetSecureLoginData()
{
  Order.call(this, 'd', GetSecureLoginDataResponse);
}

inherits(GetSecureLoginData, Order);

