// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var murmur2 = require('murmur-hash-js').murmur2;
var buf2hex = require('../buf2hex');
var Order = require('../Order');
var ErrorCodeResponse = require('./ErrorCodeResponse');

module.exports = FactoryLogin;

/**
 * @constructor
 * @extends {Order}
 * @param {Buffer} secretKey
 * @param {string} password
 * @param {number} hashSeed
 */
function FactoryLogin(secretKey, password, hashSeed)
{
  Order.call(this, 'C', ErrorCodeResponse);

  /**
   * @type {Buffer}
   */
  this.secretKey = secretKey;

  /**
   * @type {string}
   */
  this.password = password;

  /**
   * @type {number}
   */
  this.hashSeed = hashSeed;
}

inherits(FactoryLogin, Order);

/**
 * @returns {object}
 */
FactoryLogin.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.secretKey = buf2hex(this.secretKey);
  obj.password = this.password.replace(/./g, '*');
  obj.hashSeed = this.hashSeed.toString().replace(/./g, '*');

  return obj;
};

/**
 * @returns {Buffer}
 */
FactoryLogin.prototype.encodeData = function()
{
  var dataBuffer = new Buffer(4);
  var hashBuffer = Buffer.concat([this.secretKey, new Buffer(this.password, 'ascii')]);
  var hash = murmur2(hashBuffer, this.hashSeed);

  dataBuffer.writeUInt32LE(hash, 0);

  return dataBuffer;
};
