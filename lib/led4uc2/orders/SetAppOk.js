// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var ErrorCodeResponse = require('./ErrorCodeResponse');

module.exports = SetAppOk;

/**
 * @constructor
 * @extends {Order}
 */
function SetAppOk()
{
  Order.call(this, '8', ErrorCodeResponse);
}

inherits(SetAppOk, Order);

/**
 * @const
 * @type {number}
 */
SetAppOk.KEY = 0xAA55A55A;

/**
 * @returns {Buffer}
 */
SetAppOk.prototype.encodeData = function()
{
  var dataBuffer = new Buffer(4);

  dataBuffer.writeUInt32LE(SetAppOk.KEY, 0);

  return dataBuffer;
};
