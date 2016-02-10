// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var Response = require('../Response');

module.exports = SetTextInfo;

/**
 * @constructor
 * @extends {Order}
 * @param {string} text
 * @throws {Error} If any argument is invalid.
 */
function SetTextInfo(text)
{
  Order.call(this, 'T', null, Response);

  if (typeof text !== 'string')
  {
    throw new Error('The `SetTextInfo.text` must be a string.');
  }

  if (Buffer.byteLength(text) > 240)
  {
    throw new Error('The `SetTextInfo.text` must have at most 240 bytes.');
  }

  /**
   * @type {string}
   */
  this.text = text;
}

inherits(SetTextInfo, Order);

/**
 * @param {object} obj
 * @param {string} obj.text
 * @returns {SetTextInfo}
 * @throws {Error} If any property is invalid.
 */
SetTextInfo.fromObject = function(obj)
{
  return new SetTextInfo(obj.text);
};

/**
 * @returns {object}
 */
SetTextInfo.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.text = this.text;

  return obj;
};

/**
 * @returns {Buffer}
 */
SetTextInfo.prototype.encodeData = function()
{
  var dataBuffer = new Buffer(240);

  dataBuffer.fill(0).write(this.text, 0, this.text.length, 'ascii');

  return dataBuffer;
};
