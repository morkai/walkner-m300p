// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var util = require('util');

module.exports = BadOrderError;

/**
 * @constructor
 * @extends {Error}
 * @param {Request} request
 * @param {Response} response
 */
function BadOrderError(request, response)
{
  Error.captureStackTrace(this, this.constructor);

  /**
   * @type {string}
   */
  this.name = this.constructor.name;

  /**
   * @type {string}
   */
  this.code = 'LED4UC2:BAD_ORDER';

  /**
   * @type {string}
   */
  this.message = 'The requested order is undefined or locked: ' + request.code;

  /**
   * @type {Request}
   */
  this.request = request;

  /**
   * @type {Response}
   */
  this.response = response;
}

util.inherits(BadOrderError, Error);
