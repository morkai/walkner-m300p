// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var crc16arc = require('../crc16arc');
var Order = require('../Order');
var ErrorCodeResponse = require('./ErrorCodeResponse');

module.exports = FinishProgramming;

/**
 * @constructor
 * @extends {Order}
 * @param {number|Buffer|Array.<Buffer>} checksumOrProgramData
 */
function FinishProgramming(checksumOrProgramData)
{
  Order.call(this, '5', ErrorCodeResponse);

  /**
   * @type {number}
   */
  this.checksum = -1;

  if (typeof checksumOrProgramData === 'number')
  {
    this.checksum = checksumOrProgramData;
  }
  else if (Buffer.isBuffer(checksumOrProgramData))
  {
    this.checksum = crc16arc(-1, checksumOrProgramData);
  }
  else
  {
    for (var i = 0; i < checksumOrProgramData.length; ++i)
    {
      this.checksum = crc16arc(this.checksum, checksumOrProgramData[i]);
    }
  }
}

inherits(FinishProgramming, Order);

/**
 * @returns {object}
 */
FinishProgramming.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.checksum = this.checksum;

  return obj;
};

/**
 * @returns {Buffer}
 */
FinishProgramming.prototype.encodeData = function()
{
  var dataBuffer = new Buffer(2);

  dataBuffer.writeUInt16LE(this.checksum, 0);

  return dataBuffer;
};
