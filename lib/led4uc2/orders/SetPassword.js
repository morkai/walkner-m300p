// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var Response = require('../Response');
var LoginLevel = require('../LoginLevel');

module.exports = SetPassword;

/**
 * @constructor
 * @extends {Order}
 * @param {LoginLevel} loginLevel
 * @param {string} oldPassword
 * @param {string} newPassword
 */
function SetPassword(loginLevel, oldPassword, newPassword)
{
  Order.call(this, 'W', null, Response);

  /**
   * @type {LoginLevel}
   */
  this.loginLevel = loginLevel;

  /**
   * @type {string}
   */
  this.oldPassword = oldPassword;

  /**
   * @type {string}
   */
  this.newPassword = newPassword;
}

inherits(SetPassword, Order);

/**
 * @returns {object}
 */
SetPassword.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.loginLevel = LoginLevel.toString(this.loginLevel);
  obj.oldPassword = this.oldPassword.replace(/./g, '*');
  obj.newPassword = this.newPassword.replace(/./g, '*');

  return obj;
};

/**
 * @returns {Buffer}
 */
SetPassword.prototype.encodeData = function()
{
  var dataBuffer = new Buffer(17);

  dataBuffer.fill(dataBuffer.length);
  dataBuffer[0] = this.loginLevel;
  dataBuffer.write(this.oldPassword, 1, this.oldPassword.length, 'ascii');
  dataBuffer.write(this.newPassword, 9, this.newPassword.length, 'ascii');

  return dataBuffer;
};
