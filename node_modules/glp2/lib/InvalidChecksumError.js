// Copyright (c) 2015, Łukasz Walukiewicz <lukasz@miracle.systems>.
// Licensed under the MIT License <http://opensource.org/licenses/MIT>.
// Part of the node-glp2 project <http://miracle.systems/p/node-glp2>.

'use strict';

var util = require('./util');

module.exports = InvalidChecksumError;

/**
 * @constructor
 * @extends {Error}
 * @param {Buffer} [buffer]
 * @param {string} [calculatedChecksum]
 */
function InvalidChecksumError(buffer, calculatedChecksum)
{
  Error.captureStackTrace(this, this.constructor);

  var expectedChecksum = arguments.length === 2
    ? String.fromCharCode(buffer[buffer.length - 3]) + String.fromCharCode(buffer[buffer.length - 2])
    : null;

  /**
   * @type {Buffer}
   */
  this.buffer = buffer;

  /**
   * @type {string}
   */
  this.name = this.constructor.name;

  /**
   * @type {string}
   */
  this.code = 'GLP2:INVALID_CHECKSUM';

  /**
   * @type {string}
   */
  this.message = expectedChecksum === null ? "Invalid request checksum." : util.format(
    "Invalid checksum. Expected `0x%s`, calculated `0x%s` from: `%s`",
    expectedChecksum,
    calculatedChecksum,
    util.prettifyBuffer(buffer)
  );
}

util.inherits(InvalidChecksumError, Error);
