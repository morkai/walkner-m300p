// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var TextResponse = require('./TextResponse');

module.exports = GetBluetoothInfo;

/**
 * @constructor
 * @extends {Order}
 * @param {number} atCommand
 */
function GetBluetoothInfo(atCommand)
{
  Order.call(this, 'l', TextResponse);

  /**
   * @type {number}
   */
  this.atCommand = atCommand;
}

inherits(GetBluetoothInfo, Order);

/**
 * @returns {object}
 */
GetBluetoothInfo.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.atCommand = this.atCommand;

  return obj;
};

/**
 * @returns {Buffer}
 */
GetBluetoothInfo.prototype.encodeData = function()
{
  var dataBuffer = new Buffer(2);

  dataBuffer.writeUInt16LE(this.atCommand, 0);

  return dataBuffer;
};
