// Copyright (c) 2015, Łukasz Walukiewicz <lukasz@miracle.systems>.
// Licensed under the MIT License <http://opensource.org/licenses/MIT>.
// Part of the node-glp2 project <http://miracle.systems/p/node-glp2>.

'use strict';

var util = require('./util');

module.exports = InvalidResponseError;

/**
 * @constructor
 * @extends {Error}
 * @param {Buffer|BufferQueueReader} incomingData
 */
function InvalidResponseError(incomingData)
{
  Error.captureStackTrace(this, this.constructor);

  /**
   * @type {Buffer}
   */
  this.responseBuffer = Buffer.isBuffer(incomingData) ? incomingData : incomingData.readBuffer(0, incomingData.length);

  /**
   * @type {string}
   */
  this.name = this.constructor.name;

  /**
   * @type {string}
   */
  this.code = 'GLP2:INVALID_RESPONSE';

  /**
   * @type {string}
   */
  this.message = "Invalid response: " + util.prettifyBuffer(this.responseBuffer);
}

util.inherits(InvalidResponseError, Error);
