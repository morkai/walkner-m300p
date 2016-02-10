// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var buf2hex = require('../buf2hex');
var crc16arc = require('../crc16arc');
var Order = require('../Order');
var ErrorCodeResponse = require('./ErrorCodeResponse');

module.exports = ProgramData;

/**
 * @constructor
 * @extends {Order}
 * @param {ProgramData.AddressType} addressType
 * @param {number} startingAddress
 * @param {Buffer} data
 */
function ProgramData(addressType, startingAddress, data)
{
  Order.call(this, '2', ErrorCodeResponse);

  /**
   * @type {ProgramData.AddressType}
   */
  this.addressType = addressType;

  /**
   * @type {number}
   */
  this.dataLength = data.length;

  /**
   * @type {number}
   */
  this.startingAddress = startingAddress;

  /**
   * @type {number}
   */
  this.checksum = crc16arc(-1, data);

  /**
   * @type {number}
   */
  this.data = data;
}

inherits(ProgramData, Order);

/**
 * @returns {object}
 */
ProgramData.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.addressType = ProgramData.AddressType.toString(this.addressType);
  obj.startingAddress = this.startingAddress;
  obj.checksum = this.checksum;
  obj.data = buf2hex(this.data);
  obj.dataLength = this.dataLength;

  return obj;
};

/**
 * @returns {Buffer}
 */
ProgramData.prototype.encodeData = function()
{
  var dataBuffer = new Buffer(8 + this.dataLength);

  dataBuffer[0] = this.addressType;
  dataBuffer[1] = this.dataLength;
  dataBuffer.writeUInt32LE(this.startingAddress, 2);
  dataBuffer.writeUInt16LE(this.checksum, 6);

  this.data.copy(dataBuffer, 8);

  return dataBuffer;
};

/**
 * @enum {number}
 */
ProgramData.AddressType = {
  ABSOLUTE: 1,
  RELATIVE: 2
};

Object.defineProperty(ProgramData.AddressType, 'toString', {
  value: function(value)
  {
    switch (value)
    {
      case 1: return 'ABSOLUTE';
      case 2: return 'RELATIVE';
      default: return null;
    }
  }
});
