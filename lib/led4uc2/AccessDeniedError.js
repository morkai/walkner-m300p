// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var util = require('util');

module.exports = AccessDeniedError;

/**
 * @constructor
 * @extends {Error}
 * @param {Request} request
 * @param {Response} response
 */
function AccessDeniedError(request, response)
{
  Error.captureStackTrace(this, this.constructor);

  /**
   * @type {string}
   */
  this.name = this.constructor.name;

  /**
   * @type {string}
   */
  this.code = 'LED4UC2:ACCESS_DENIED';

  /**
   * @type {string}
   */
  this.message = 'Access to the `' + request.code + "` order was denied. Check the order's required access level.";

  /**
   * @type {Request}
   */
  this.request = request;

  /**
   * @type {Response}
   */
  this.response = response;
}

util.inherits(AccessDeniedError, Error);
