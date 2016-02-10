// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Response = require('../Response');

module.exports = GetInfoResponse;

/**
 * @constructor
 * @extends {Response}
 * @param {number} address
 * @param {number} requestId
 * @param {string} code
 * @param {ResponseStatus} status
 * @param {Buffer} data
 */
function GetInfoResponse(address, requestId, code, status, data)
{
  Response.apply(this, arguments);

  /**
   * @type {Date}
   */
  this.compilationDate = new Date(data.toString('ascii', 0, 21).replace(/\u0000/g, ' '));

  /**
   * @type {number}
   */
  this.cpuMemorySize = data.readUInt16LE(21) * 1024;

  /**
   * @type {number}
   */
  this.flashMemorySize = data.readUInt32LE(23);

  /**
   * @type {number}
   */
  this.cpuId = data.readUInt32LE(27);

  /**
   * @type {Array.<number>}
   */
  this.cpuSerialNo = [data.readUInt32LE(31), data.readUInt32LE(35), data.readUInt32LE(39)];

  /**
   * @type {boolean}
   */
  this.factoryDls = data[43] === 1;

  /**
   * @type {boolean}
   */
  this.factoryPir = data[44] === 1;

  /**
   * @type {number}
   */
  this.lensType = data[45];

  /**
   * @type {Array.<number>}
   */
  this.initialEnergyConsumed = new Array(8);

  for (var i = 0; i < 8; ++i)
  {
    this.initialEnergyConsumed[i] = data.readUInt32LE(46 + i * 4);
  }
}

inherits(GetInfoResponse, Response);

/**
 * @returns {object}
 */
GetInfoResponse.prototype.inspect = function()
{
  var obj = Response.prototype.inspect.call(this);

  obj.compilationDate = this.compilationDate.toISOString();
  obj.cpuMemorySize = this.cpuMemorySize;
  obj.flashMemorySize = this.flashMemorySize;
  obj.cpuId = this.cpuId;
  obj.cpuSerialNo = this.cpuSerialNo;
  obj.factoryDls = this.factoryDls;
  obj.factoryPir = this.factoryPir;
  obj.lensType = this.lensType;
  obj.initialEnergyConsumed = this.initialEnergyConsumed;

  return obj;
};
