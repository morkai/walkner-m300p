// Copyright (c) 2015, Łukasz Walukiewicz <lukasz@miracle.systems>.
// Licensed under the MIT License <http://opensource.org/licenses/MIT>.
// Part of the node-glp2 project <http://miracle.systems/p/node-glp2>.

'use strict';

var util = require('./util');

module.exports = NoConnectionError;

/**
 * @constructor
 * @extends {Error}
 */
function NoConnectionError()
{
  Error.captureStackTrace(this, this.constructor);

  /**
   * @type {string}
   */
  this.name = this.constructor.name;

  /**
   * @type {string}
   */
  this.code = 'GLP2:NO_CONNECTION';

  /**
   * @type {string}
   */
  this.message = "No serial port connection.";
}

util.inherits(NoConnectionError, Error);
