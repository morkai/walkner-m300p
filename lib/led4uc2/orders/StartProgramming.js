// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var ErrorCodeResponse = require('./ErrorCodeResponse');

module.exports = StartProgramming;

/**
 * @constructor
 * @extends {Order}
 * @param {number} programSize
 */
function StartProgramming(programSize)
{
  Order.call(this, '1', ErrorCodeResponse);

  /**
   * @type {number}
   */
  this.programSize = programSize;
}

inherits(StartProgramming, Order);

/**
 * @returns {object}
 */
StartProgramming.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.programSize = this.programSize;

  return obj;
};

/**
 * @returns {Buffer}
 */
StartProgramming.prototype.encodeData = function()
{
  var dataBuffer = new Buffer([4]);

  dataBuffer.writeUInt32LE(this.programSize, 0);

  return dataBuffer;
};
