// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var BufferReader = require('h5.buffers').BufferReader;
var Response = require('../Response');
var BootloaderState = require('../BootloaderState');

module.exports = GetBootStatusResponse;

/**
 * @constructor
 * @extends {Response}
 * @param {number} address
 * @param {number} requestId
 * @param {string} code
 * @param {ResponseStatus} status
 * @param {Buffer} data
 */
function GetBootStatusResponse(address, requestId, code, status, data)
{
  Response.apply(this, arguments);

  var dataReader = new BufferReader(data);

  /**
   * @type {number}
   */
  this.flashMemorySize = dataReader.shiftUInt32(true);

  /**
   * @type {number}
   */
  this.appName = dataReader.shiftString(4, 'ascii').replace(/\u0000/g, '');

  /**
   * @type {string}
   */
  this.appVersion = dataReader.shiftUInt8() + '.' + dataReader.shiftUInt8() + '.' + dataReader.shiftUInt8();

  /**
   * @type {number}
   */
  this.appSize = dataReader.shiftUInt8();

  /**
   * @type {number}
   */
  this.appOk = dataReader.shiftUInt8() === 1;

  /**
   * @type {number}
   */
  this.appCorrect = dataReader.shiftUInt8() === 1;

  /**
   * @type {BootloaderState}
   */
  this.state = dataReader.shiftUInt8();
}

inherits(GetBootStatusResponse, Response);

/**
 * @returns {object}
 */
GetBootStatusResponse.prototype.inspect = function()
{
  var obj = Response.prototype.inspect.call(this);

  obj.flashMemorySize = this.flashMemorySize;
  obj.appName = this.appName;
  obj.appVersion = this.appVersion;
  obj.appSize = this.appSize;
  obj.appOk = this.appOk;
  obj.appCorrect = this.appCorrect;
  obj.state = BootloaderState.toString(this.state);

  return obj;
};
