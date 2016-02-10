// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');

module.exports = SetPreview;

/**
 * @constructor
 * @extends {Order}
 * @param {string} code
 * @param {number} leadInTime
 * @param {number} fadeInTime
 * @param {number} highLevel
 * @param {number} highTime
 * @param {number} fadeOutTime
 * @param {number} lowLevel
 * @param {boolean} shutDown
 * @param {number} leadOutTime
 * @throws {Error} If any argument is invalid.
 */
function SetPreview(code, leadInTime, fadeInTime, highLevel, highTime, fadeOutTime, lowLevel, shutDown, leadOutTime)
{
  Order.call(this, code);

  if (typeof leadInTime !== 'number' || leadInTime < 0 || leadInTime > 30)
  {
    throw new Error('The `' + this.constructor.name + '.leadInTime` must be a number between 0.0 and 30.');
  }

  if (typeof fadeInTime !== 'number' || fadeInTime < 0 || fadeInTime > 30)
  {
    throw new Error('The `' + this.constructor.name + '.fadeInTime` must be a number between 0.0 and 30.');
  }

  if (typeof highLevel !== 'number' || highLevel < 0 || highLevel > 100)
  {
    throw new Error('The `' + this.constructor.name + '.highLevel` must be a number between 0.0 and 100.');
  }

  if (typeof highTime !== 'number' || highTime < 0 || highTime > 30)
  {
    throw new Error('The `' + this.constructor.name + '.highTime` must be a number between 0.0 and 30.');
  }

  if (typeof fadeOutTime !== 'number' || fadeOutTime < 0 || fadeOutTime > 30)
  {
    throw new Error('The `' + this.constructor.name + '.fadeOutTime` must be a number between 0.0 and 30.');
  }

  if (typeof lowLevel !== 'number' || lowLevel < 0 || lowLevel > 100)
  {
    throw new Error('The `' + this.constructor.name + '.lowLevel` must be a number between 0.0 and 100.');
  }

  if (typeof shutDown !== 'boolean')
  {
    throw new Error('The `' + this.constructor.name + '.shutDown` must be a boolean.');
  }

  if (typeof leadOutTime !== 'number' || leadOutTime < 0 || leadOutTime > 30)
  {
    throw new Error('The `' + this.constructor.name + '.leadOutTime` must be a number between 0.0 and 30.');
  }

  /**
   * @type {number}
   */
  this.leadInTime = leadInTime;

  /**
   * @type {number}
   */
  this.fadeInTime = fadeInTime;

  /**
   * @type {number}
   */
  this.highLevel = highLevel;

  /**
   * @type {number}
   */
  this.highTime = highTime;

  /**
   * @type {number}
   */
  this.fadeOutTime = fadeOutTime;

  /**
   * @type {number}
   */
  this.lowLevel = lowLevel;

  /**
   * @type {boolean}
   */
  this.shutDown = shutDown;

  /**
   * @type {number}
   */
  this.leadOutTime = leadOutTime;
}

inherits(SetPreview, Order);

/**
 * @param {function(new:SetPreview)} SetPreviewType
 * @param {object} obj
 * @param {number} obj.leadInTime
 * @param {number} obj.fadeInTime
 * @param {number} obj.highLevel
 * @param {number} obj.highTime
 * @param {number} obj.fadeOutTime
 * @param {number} obj.lowLevel
 * @param {boolean} obj.shutDown
 * @param {number} obj.leadOutTime
 * @returns {SetPreview}
 * @throws {Error} If any property is invalid.
 */
SetPreview.fromObject = function(SetPreviewType, obj)
{
  return new SetPreviewType(
    obj.leadInTime,
    obj.fadeInTime,
    obj.highLevel,
    obj.highTime,
    obj.fadeOutTime,
    obj.lowLevel,
    !!obj.shutDown,
    obj.leadOutTime
  );
};

/**
 * @returns {object}
 */
SetPreview.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.leadInTime = this.leadInTime;
  obj.fadeInTime = this.fadeInTime;
  obj.highLevel = this.highLevel;
  obj.highTime = this.highTime;
  obj.fadeOutTime = this.fadeOutTime;
  obj.lowLevel = this.lowLevel;
  obj.shutDown = this.shutDown;
  obj.leadOutTime = this.leadOutTime;

  return obj;
};

/**
 * @returns {Buffer}
 */
SetPreview.prototype.encodeData = function()
{
  var dataBuffer = new Buffer(15);

  dataBuffer.writeUInt16LE(Math.round(this.leadInTime * 10), 0);
  dataBuffer.writeUInt16LE(Math.round(this.fadeInTime * 10), 2);
  dataBuffer.writeUInt16LE(Math.round(this.highLevel * 10), 4);
  dataBuffer.writeUInt16LE(Math.round(this.highTime * 10), 6);
  dataBuffer.writeUInt16LE(Math.round(this.fadeOutTime * 10), 8);
  dataBuffer.writeUInt16LE(Math.round(this.lowLevel * 10), 10);
  dataBuffer[12] = this.shutDown ? 1 : 0;
  dataBuffer.writeUInt16LE(Math.round(this.leadOutTime * 10), 13);

  return dataBuffer;
};
