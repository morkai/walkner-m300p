// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Response = require('../Response');

module.exports = GetNameAndNumberResponse;

/**
 * @constructor
 * @extends {Response}
 * @param {number} address
 * @param {number} requestId
 * @param {string} code
 * @param {ResponseStatus} status
 * @param {Buffer} data
 */
function GetNameAndNumberResponse(address, requestId, code, status, data)
{
  Response.apply(this, arguments);

  /**
   * @type {number}
   */
  this.name = data.toString('ascii', 0, 30).replace(/\u0000/g, '');

  /**
   * @type {number}
   */
  this.number = data[30];
}

inherits(GetNameAndNumberResponse, Response);

/**
 * @returns {object}
 */
GetNameAndNumberResponse.prototype.inspect = function()
{
  var obj = Response.prototype.inspect.call(this);

  obj.setName = this.name;
  obj.number = this.number;

  return obj;
};
