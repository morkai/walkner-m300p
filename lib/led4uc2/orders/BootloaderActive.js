// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var BootloaderActiveResponse = require('./BootloaderActiveResponse');

module.exports = BootloaderActive;

/**
 * @constructor
 * @extends {Order}
 */
function BootloaderActive()
{
  Order.call(this, '0', BootloaderActiveResponse);
}

inherits(BootloaderActive, Order);
