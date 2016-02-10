// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var Response = require('../Response');
var Config = require('../Config');

module.exports = SetConfig;

/**
 * @constructor
 * @extends {Order}
 * @param {Config} config
 * @throws {Error} If any argument is invalid.
 */
function SetConfig(config)
{
  Order.call(this, 'Q', null, Response);

  if (!(config instanceof Config))
  {
    throw new Error('The `SetConfig.config` must be an instance of `Config`.');
  }

  /**
   * @type {Config}
   */
  this.config = config;
}

inherits(SetConfig, Order);

/**
 * @param {object} obj
 * @param {object} obj.pir
 * @param {number} obj.pir.onLevel
 * @param {number} obj.pir.dimLevel
 * @param {number} obj.pir.fadeIn
 * @param {number} obj.pir.fadeOut
 * @param {number} obj.pir.delay
 * @param {number} obj.pir.flag
 * @param {number} obj.pir.sensitivity
 * @param {number} obj.maxLampPower
 * @param {object} obj.dls
 * @param {number} obj.dls.onLevel
 * @param {number} obj.dls.dimLevel
 * @param {number} obj.dls.fadeIn
 * @param {number} obj.dls.fadeOut
 * @param {number} obj.dls.delay
 * @param {number} obj.dls.flag
 * @param {number} obj.dls.onThreshold
 * @param {number} obj.dls.offThreshold
 * @param {object} obj.selectingBlinking
 * @param {number} obj.selectingBlinking.timeOn
 * @param {number} obj.selectingBlinking.timeOff
 * @param {number} obj.selectingBlinking.pulses
 * @param {object} obj.warningBlinking
 * @param {number} obj.warningBlinking.timeOn
 * @param {number} obj.warningBlinking.timeOff
 * @param {number} obj.warningBlinking.pulses
 * @param {number} obj.fixedLevel
 * @param {number|string} obj.workMode
 * @param {number} obj.dlsSetValue
 * @returns {SetConfig}
 * @throws {Error} If any property is invalid.
 */
SetConfig.fromObject = function(obj)
{
  return new SetConfig(Config.fromObject(obj));
};

/**
 * @returns {object}
 */
SetConfig.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.config = this.config;

  return obj;
};

/**
 * @returns {Buffer}
 */
SetConfig.prototype.encodeData = function()
{
  return this.config.encodeData();
};
