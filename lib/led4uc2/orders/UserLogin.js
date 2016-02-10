// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var ErrorCodeResponse = require('./ErrorCodeResponse');

module.exports = UserLogin;

/**
 * @constructor
 * @extends {Order}
 * @param {string} password
 */
function UserLogin(password)
{
  Order.call(this, 'L', ErrorCodeResponse);

  /**
   * @type {string}
   */
  this.password = password;
}

inherits(UserLogin, Order);

/**
 * @returns {object}
 */
UserLogin.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.password = this.password.replace(/./g, '*');

  return obj;
};

/**
 * @returns {Buffer}
 */
UserLogin.prototype.encodeData = function()
{
  var dataBuffer = new Buffer(4);

  dataBuffer.fill(0).write(this.password, 0, this.password.length, 'ascii');

  return dataBuffer;
};
