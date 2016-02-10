// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var Response = require('../Response');

module.exports = SetNameAndNumber;

/**
 * @constructor
 * @extends {Order}
 * @param {string} name
 * @param {number} number
 * @throws {Error} If any argument is invalid.
 */
function SetNameAndNumber(name, number)
{
  Order.call(this, 'O', null, Response);

  if (typeof name !== 'string')
  {
    throw new Error('The `SetNameAndNumber.name` must be a string.');
  }

  if (Buffer.byteLength(name) > 30)
  {
    throw new Error('The `SetNameAndNumber.name` must have at most 30 bytes.');
  }

  if (typeof number !== 'number' || number < 0 || number > 0xFF)
  {
    throw new Error('The `SetNameAndNumber.number` must be an uint8.');
  }

  /**
   * @type {string}
   */
  this.name = name;

  /**
   * @type {number}
   */
  this.number = number;
}

inherits(SetNameAndNumber, Order);

/**
 * @param {object} obj
 * @param {string} obj.name
 * @param {number} obj.number
 * @returns {SetNameAndNumber}
 * @throws {Error} If any property is invalid.
 */
SetNameAndNumber.fromObject = function(obj)
{
  return new SetNameAndNumber(obj.name, obj.number);
};

/**
 * @returns {object}
 */
SetNameAndNumber.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.name = this.name;
  obj.number = this.number;

  return obj;
};

/**
 * @returns {Buffer}
 */
SetNameAndNumber.prototype.encodeData = function()
{
  var dataBuffer = new Buffer(31);

  dataBuffer.fill(0).write(this.name, 0, 30, 'ascii');
  dataBuffer.writeUInt8(this.number, 30);

  return dataBuffer;
};
