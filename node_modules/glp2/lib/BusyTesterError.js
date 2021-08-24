// Copyright (c) 2015, Łukasz Walukiewicz <lukasz@miracle.systems>.
// Licensed under the MIT License <http://opensource.org/licenses/MIT>.
// Part of the node-glp2 project <http://miracle.systems/p/node-glp2>.

'use strict';

var util = require('./util');

module.exports = BusyTesterError;

/**
 * @constructor
 */
function BusyTesterError()
{
  Error.captureStackTrace(this, this.constructor);

  /**
   * @type {string}
   */
  this.name = this.constructor.name;

  /**
   * @type {string}
   */
  this.code = 'GLP2:BUSY_TESTER';

  /**
   * @type {string}
   */
  this.message = "Test is in progress or Blackbox test is required.";
}

util.inherits(BusyTesterError, Error);
