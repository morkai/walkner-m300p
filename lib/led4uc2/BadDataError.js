// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var util = require('util');
var buf2hex = require('./buf2hex');

module.exports = BadDataError;

/**
 * @constructor
 * @extends {Error}
 * @param {Request} request
 * @param {Response} response
 */
function BadDataError(request, response)
{
  Error.captureStackTrace(this, this.constructor);

  /**
   * @type {string}
   */
  this.name = this.constructor.name;

  /**
   * @type {string}
   */
  this.code = 'LED4UC2:BAD_DATA';

  /**
   * @type {string}
   */
  this.message = 'The request is too short or contains invalid values: ' + buf2hex(request.frame);

  /**
   * @type {Request}
   */
  this.request = request;

  /**
   * @type {Response}
   */
  this.response = response;
}

util.inherits(BadDataError, Error);
