// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var Response = require('./Response');

module.exports = Order;

/**
 * @constructor
 * @param {string} code
 * @param {function(new:Response)} [directResponseType]
 * @param {function(new:Response)} [indirectResponseType]
 */
function Order(code, directResponseType, indirectResponseType)
{
  /**
   * @type {string}
   */
  this.code = code;

  /**
   * @type {function(new:Response)}
   */
  this.directResponseType = directResponseType || Response;

  /**
   * @type {function(new:Response)}
   */
  this.indirectResponseType = indirectResponseType || null;
}

/**
 * @returns {object}
 */
Order.prototype.inspect = function()
{
  return {
    name: this.constructor.name,
    code: this.code,
    directResponseType: this.directResponseType.name,
    indirectResponse: this.indirectResponseType ? this.indirectResponseType.name : null
  };
};

/**
 * @param {number} address
 * @param {number} requestId
 * @param {ResponseStatus} status
 * @param {Buffer} data
 * @returns {Response}
 */
Order.prototype.createDirectResponse = function(address, requestId, status, data)
{
  /* eslint-disable new-cap */

  return new this.directResponseType(address, requestId, this.code, status, data);
};

/**
 * @param {number} address
 * @param {number} requestId
 * @param {ResponseStatus} status
 * @param {Buffer} data
 * @returns {Response}
 * @throws {Error}
 */
Order.prototype.createIndirectResponse = function(address, requestId, status, data)
{
  if (this.indirectResponseType === null)
  {
    throw new Error("The `' + this.constructor.name + '` order doesn't support indirect responses.");
  }

  return new this.indirectResponseType(address, requestId, this.code, status, data);
};

/**
 * @returns {Buffer}
 */
Order.prototype.encodeData = function()
{
  return new Buffer(0);
};
