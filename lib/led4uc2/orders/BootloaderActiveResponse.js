// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Response = require('../Response');

module.exports = BootloaderActiveResponse;

/**
 * @constructor
 * @extends {Response}
 * @param {number} address
 * @param {number} requestId
 * @param {string} code
 * @param {ResponseStatus} status
 * @param {Buffer} data
 */
function BootloaderActiveResponse(address, requestId, code, status, data)
{
  Response.apply(this, arguments);

  /**
   * @type {number}
   */
  this.active = data[0] === 1;
}

inherits(BootloaderActiveResponse, Response);

/**
 * @returns {object}
 */
BootloaderActiveResponse.prototype.inspect = function()
{
  var obj = Response.prototype.inspect.call(this);

  obj.active = this.active;

  return obj;
};
