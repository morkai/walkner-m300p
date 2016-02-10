// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Response = require('../Response');
var EmergencyMode = require('../EmergencyMode');

module.exports = GetEmergencyModeResponse;

/**
 * @constructor
 * @extends {Response}
 * @param {number} address
 * @param {number} requestId
 * @param {string} code
 * @param {ResponseStatus} status
 * @param {Buffer} data
 */
function GetEmergencyModeResponse(address, requestId, code, status, data)
{
  Response.apply(this, arguments);

  /**
   * @type {EmergencyMode}
   */
  this.mode = data[0];
}

inherits(GetEmergencyModeResponse, Response);

/**
 * @returns {object}
 */
GetEmergencyModeResponse.prototype.inspect = function()
{
  var obj = Response.prototype.inspect.call(this);

  obj.mode = EmergencyMode.toString(this.mode);

  return obj;
};
