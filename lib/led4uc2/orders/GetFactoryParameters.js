// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var GetFactoryParametersResponse = require('./GetFactoryParametersResponse');

module.exports = GetFactoryParameters;

/**
 * @constructor
 * @extends {Order}
 */
function GetFactoryParameters()
{
  Order.call(this, 'i', GetFactoryParametersResponse);
}

inherits(GetFactoryParameters, Order);
