// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var util = require('util');

module.exports = ResponseTimeoutError;

/**
 * @constructor
 * @extends {Error}
 * @param {Request} request
 */
function ResponseTimeoutError(request)
{
  Error.captureStackTrace(this, this.constructor);

  /**
   * @type {string}
   */
  this.name = this.constructor.name;

  /**
   * @type {string}
   */
  this.code = 'LED4UC2:RESPONSE_TIMEOUT';

  /**
   * @type {string}
   */
  this.message = 'Response timed out.';

  /**
   * @type {Request}
   */
  this.request = request;
}

util.inherits(ResponseTimeoutError, Error);
