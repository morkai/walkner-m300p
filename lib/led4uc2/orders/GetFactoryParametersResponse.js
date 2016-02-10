// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Response = require('../Response');

module.exports = GetFactoryParametersResponse;

/**
 * @constructor
 * @extends {Response}
 * @param {number} address
 * @param {number} requestId
 * @param {string} code
 * @param {ResponseStatus} status
 * @param {Buffer} data
 */
function GetFactoryParametersResponse(address, requestId, code, status, data)
{
  Response.apply(this, arguments);

  /**
   * @type {boolean}
   */
  this.dlsEnabled = data[1] === 1;

  /**
   * @type {boolean}
   */
  this.pirEnabled = data[2] === 1;

  /**
   * @type {number}
   */
  this.lensType = data[3];

  /**
   * @type {number}
   */
  this.daliMinLevel = data[4];

  /**
   * @type {number}
   */
  this.startDelay = data[5];

  /**
   * @type {number}
   */
  this.rtcCalibration = data[6];

  /**
   * @type {number|null}
   */
  this.pirSensitivity = data.readUInt16LE(7);

  /**
   * @type {number}
   */
  this.dlsCalibration = data.readUInt16LE(9);
}

inherits(GetFactoryParametersResponse, Response);

/**
 * @returns {object}
 */
GetFactoryParametersResponse.prototype.inspect = function()
{
  var obj = Response.prototype.inspect.call(this);

  obj.dlsEnabled = this.dlsEnabled;
  obj.pirEnabled = this.pirEnabled;
  obj.lensType = this.lensType;
  obj.daliMinLevel = this.daliMinLevel;
  obj.startDelay = this.startDelay;
  obj.rtcCalibration = this.rtcCalibration;
  obj.pirSensitivity = this.pirSensitivity;
  obj.dlsCalibration = this.dlsCalibration;

  return obj;
};
