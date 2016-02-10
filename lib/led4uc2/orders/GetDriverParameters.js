// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var GetDriverParametersResponse = require('./GetDriverParametersResponse');

module.exports = GetDriverParameters;

/**
 * @constructor
 * @extends {Order}
 * @param {number} driverAddress 1-7
 * @param {number} mainBank
 * @param {number} subBank
 * @param {number} offset
 * @param {number} byteCount
 */
function GetDriverParameters(driverAddress, mainBank, subBank, offset, byteCount)
{
  Order.call(this, 'a', null, GetDriverParametersResponse);

  /**
   * @type {number}
   */
  this.driverAddress = driverAddress;

  /**
   * @type {number}
   */
  this.mainBank = mainBank;

  /**
   * @type {number}
   */
  this.subBank = subBank;

  /**
   * @type {number}
   */
  this.offset = offset;

  /**
   * @type {number}
   */
  this.byteCount = byteCount;
}

inherits(GetDriverParameters, Order);

/**
 * @returns {object}
 */
GetDriverParameters.prototype.inspect = function()
{
  var obj = Order.prototype.inspect.call(this);

  obj.driverAddress = this.driverAddress;
  obj.mainBank = this.mainBank;
  obj.subBank = this.subBank;
  obj.offset = this.offset;
  obj.byteCount = this.byteCount;

  return obj;
};

/**
 * @returns {Buffer}
 */
GetDriverParameters.prototype.encodeData = function()
{
  return new Buffer([
    this.driverAddress,
    this.mainBank,
    this.subBank,
    this.offset,
    this.byteCount
  ]);
};
