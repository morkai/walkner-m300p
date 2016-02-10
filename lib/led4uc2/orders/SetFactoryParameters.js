// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var BufferBuilder = require('h5.buffers').BufferBuilder;
var Order = require('../Order');
var Response = require('../Response');

module.exports = SetFactoryParameters;

/**
 * @constructor
 * @extends {Order}
 * @param {boolean|null} dlsEnabled
 * @param {boolean|null} pirEnabled
 * @param {number|null} lensType
 * @param {number|null} daliMinLevel
 * @param {number|null} startDelay
 * @param {number|null} rtcCalibration
 * @param {number|null} pirSensitivity
 * @param {number|null} dlsCalibration
 */
function SetFactoryParameters(
  dlsEnabled,
  pirEnabled,
  lensType,
  daliMinLevel,
  startDelay,
  rtcCalibration,
  pirSensitivity,
  dlsCalibration)
{
  Order.call(this, 'I', null, Response);

  if (dlsEnabled !== null && typeof dlsEnabled !== 'boolean')
  {
    throw new Error('The `SetFactoryParameters.dlsEnabled` must be NULL or a boolean.');
  }

  if (pirEnabled !== null && typeof pirEnabled !== 'boolean')
  {
    throw new Error('The `SetFactoryParameters.pirEnabled` must be NULL or a boolean.');
  }

  if (lensType !== null && (typeof lensType !== 'number' || lensType < 0 || lensType > 0xFF))
  {
    throw new Error('The `SetFactoryParameters.lensType` must be NULL or an uint8.');
  }

  if (daliMinLevel !== null && (typeof daliMinLevel !== 'number' || daliMinLevel < 0 || daliMinLevel > 0xFF))
  {
    throw new Error('The `SetFactoryParameters.daliMinLevel` must be NULL or an uint8.');
  }

  if (startDelay !== null && (typeof startDelay !== 'number' || startDelay < 0 || startDelay > 0xFF))
  {
    throw new Error('The `SetFactoryParameters.startDelay` must be NULL or an uint8.');
  }

  if (rtcCalibration !== null && (typeof rtcCalibration !== 'number' || rtcCalibration < 0 || rtcCalibration > 127))
  {
    throw new Error('The `SetFactoryParameters.rtcCalibration` must be NULL or a number between 0 and 127.');
  }

  if (pirSensitivity !== null && (typeof pirSensitivity !== 'number' || pirSensitivity < 0 || pirSensitivity > 4095))
  {
    throw new Error('The `SetFactoryParameters.pirSensitivity` must be NULL or a number between 0 and 4095.');
  }

  if (dlsCalibration !== null && (typeof dlsCalibration !== 'number' || dlsCalibration < 0 || dlsCalibration > 0xFFFF))
  {
    throw new Error('The `SetFactoryParameters.dlsCalibration` must be NULL or an uint16.');
  }

  /**
   * @type {boolean|null}
   */
  this.dlsEnabled = dlsEnabled;

  /**
   * @type {boolean|null}
   */
  this.pirEnabled = pirEnabled;

  /**
   * @type {number|null}
   */
  this.lensType = lensType;

  /**
   * @type {number|null}
   */
  this.daliMinLevel = daliMinLevel;

  /**
   * @type {number|null}
   */
  this.startDelay = startDelay;

  /**
   * @type {number|null}
   */
  this.rtcCalibration = rtcCalibration;

  /**
   * @type {number|null}
   */
  this.pirSensitivity = pirSensitivity;

  /**
   * @type {number|null}
   */
  this.dlsCalibration = dlsCalibration;
}

inherits(SetFactoryParameters, Order);

/**
 * @param {object} obj
 * @param {boolean|null} obj.dlsEnabled
 * @param {boolean|null} obj.pirEnabled
 * @param {number|null} obj.lensType
 * @param {number|null} obj.daliMinLevel
 * @param {number|null} obj.startDelay
 * @param {number|null} obj.rtcCalibration
 * @param {number|null} obj.pirSensitivity
 * @param {number|null} obj.dlsCalibration
 * @returns {SetFactoryParameters}
 * @throws {Error} If any property is invalid.
 */
SetFactoryParameters.fromObject = function(obj)
{
  return new SetFactoryParameters(
    obj.dlsEnabled === null ? null : !!obj.dlsEnabled,
    obj.pirEnabled === null ? null : !!obj.pirEnabled,
    obj.lensType,
    obj.daliMinLevel,
    obj.startDelay,
    obj.rtcCalibration,
    obj.pirSensitivity,
    obj.dlsCalibration
  );
};

/**
 * @returns {object}
 */
SetFactoryParameters.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.dlsEnabled = this.dlsEnabled;
  obj.pirEnabled = this.pirEnabled;
  obj.lensType = this.lensType;
  obj.daliMinLevel = this.daliMinLevel;
  obj.startDelay = this.startDelay;
  obj.rtcCalibration = this.rtcCalibration;
  obj.pirSensitivity = this.pirSensitivity;
  obj.dlsCalibration = this.dlsCalibration;

  return obj;
};

/**
 * @returns {Buffer}
 */
SetFactoryParameters.prototype.encodeData = function()
{
  var dataBuilder = new BufferBuilder();

  dataBuilder.pushBits([
    this.dlsEnabled !== null,
    this.pirEnabled !== null,
    this.lensType !== null,
    this.daliMinLevel !== null,
    this.startDelay !== null,
    this.rtcCalibration !== null,
    this.pirSensitivity !== null,
    this.dlsCalibration !== null
  ]);
  dataBuilder
    .pushUInt8(this.dlsEnabled ? 1 : 0)
    .pushUInt8(this.pirEnabled ? 1 : 0)
    .pushUInt8(this.lensType || 0)
    .pushUInt8(this.daliMinLevel || 0)
    .pushUInt8(this.startDelay || 0)
    .pushUInt8(this.rtcCalibration || 0)
    .pushUInt16(this.pirSensitivity || 0, true)
    .pushUInt16(this.dlsCalibration || 0, true);

  return dataBuilder.toBuffer();
};
