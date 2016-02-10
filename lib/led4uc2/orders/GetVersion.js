// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var GetVersionResponse = require('./GetVersionResponse');

module.exports = GetVersion;

/**
 * @constructor
 * @extends {Order}
 */
function GetVersion()
{
  Order.call(this, 'v', GetVersionResponse);
}

inherits(GetVersion, Order);

