// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var Response = require('../Response');

module.exports = SetSerialNumber;

/**
 * @constructor
 * @extends {Order}
 * @param {string} serialNumber
 * @throws {Error} If any argument is invalid.
 */
function SetSerialNumber(serialNumber)
{
  Order.call(this, 'Z', null, Response);

  if (typeof serialNumber !== 'string')
  {
    throw new Error('The `SetSerialNumber.serialNumber` must be a string.');
  }

  if (Buffer.byteLength(serialNumber) > 240)
  {
    throw new Error('The `SetSerialNumber.serialNumber` must have at most 240 bytes.');
  }

  /**
   * @type {string}
   */
  this.serialNumber = serialNumber;
}

inherits(SetSerialNumber, Order);

/**
 * @param {object} obj
 * @param {string} obj.serialNumber
 * @returns {SetSerialNumber}
 * @throws {Error} If any property is invalid.
 */
SetSerialNumber.fromObject = function(obj)
{
  return new SetSerialNumber(obj.serialNumber);
};

/**
 * @returns {object}
 */
SetSerialNumber.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.serialNumber = this.serialNumber;

  return obj;
};

/**
 * @returns {Buffer}
 */
SetSerialNumber.prototype.encodeData = function()
{
  var dataBuffer = new Buffer(240);

  dataBuffer.fill(0).write(this.serialNumber, 0, this.serialNumber.length, 'ascii');

  return dataBuffer;
};
