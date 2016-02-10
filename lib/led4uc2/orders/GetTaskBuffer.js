// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var GetTaskBufferResponse = require('./GetTaskBufferResponse');

module.exports = GetTaskBuffer;

/**
 * @constructor
 * @extends {Order}
 */
function GetTaskBuffer()
{
  Order.call(this, 'A', GetTaskBufferResponse);
}

inherits(GetTaskBuffer, Order);

/**
 * @returns {Buffer}
 */
GetTaskBuffer.prototype.encodeData = function()
{
  return new Buffer([
    0
  ]);
};
