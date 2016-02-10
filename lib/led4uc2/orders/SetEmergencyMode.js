// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var Response = require('../Response');
var EmergencyMode = require('../EmergencyMode');

module.exports = SetEmergencyMode;

/**
 * @constructor
 * @extends {Order}
 * @param {EmergencyMode|string} mode
 */
function SetEmergencyMode(mode)
{
  Order.call(this, 'Y', null, Response);

  /**
   * @type {EmergencyMode}
   */
  this.mode = typeof mode === 'string' ? EmergencyMode[mode.toUpperCase()] : mode;
}

inherits(SetEmergencyMode, Order);

/**
 * @returns {object}
 */
SetEmergencyMode.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.mode = EmergencyMode.toString(this.mode);

  return obj;
};

/**
 * @returns {Buffer}
 */
SetEmergencyMode.prototype.encodeData = function()
{
  return new Buffer([
    this.mode
  ]);
};
