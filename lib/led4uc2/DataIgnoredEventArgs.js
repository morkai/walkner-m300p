// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var buf2hex = require('./buf2hex');

module.exports = DataIgnoredEventArgs;

/**
 * @constructor
 * @param {string} reason
 * @param {Buffer} data
 * @param {ResponseStatus|null} [status]
 * @param {*} [required]
 * @param {*} [actual]
 */
function DataIgnoredEventArgs(reason, data, status, required, actual)
{
  /**
   * @type {string}
   */
  this.reason = reason;

  /**
   * @type {Buffer}
   */
  this.data = data;

  /**
   * @type {ResponseStatus|null}
   */
  this.status = typeof status === 'undefined' ? null : status;

  /**
   * @type {*}
   */
  this.required = typeof required === 'undefined' ? null : required;

  /**
   * @type {*}
   */
  this.actual = typeof actual === 'undefined' ? null : actual;
}

/**
 * @returns {object}
 */
DataIgnoredEventArgs.prototype.inspect = function()
{
  return {
    reason: this.reason,
    data: buf2hex(this.data),
    dataLength: this.data.length,
    status: this.status,
    required: this.required,
    actual: this.actual
  };
};
