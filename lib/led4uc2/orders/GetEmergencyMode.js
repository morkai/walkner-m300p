// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var GetEmergencyModeResponse = require('./GetEmergencyModeResponse');

module.exports = GetEmergencyMode;

/**
 * @constructor
 * @extends {Order}
 */
function GetEmergencyMode()
{
  Order.call(this, 'y', GetEmergencyModeResponse);
}

inherits(GetEmergencyMode, Order);
