// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

module.exports = ResponseStatus;

/**
 * @constructor
 * @param {boolean} busy
 * @param {boolean} lastTaskError
 * @param {boolean} badOrder
 * @param {boolean} badData
 * @param {boolean} indirectOrder
 * @param {boolean} accessDenied
 * @param {boolean} configMode
 * @param {boolean} bootloader
 */
function ResponseStatus(busy, lastTaskError, badOrder, badData, indirectOrder, accessDenied, configMode, bootloader)
{
  /**
   * @type {boolean}
   */
  this.busy = busy;

  /**
   * @type {boolean}
   */
  this.lastTaskError = lastTaskError;

  /**
   * @type {boolean}
   */
  this.badOrder = badOrder;

  /**
   * @type {boolean}
   */
  this.badData = badData;

  /**
   * @type {boolean}
   */
  this.indirectOrder = indirectOrder;

  /**
   * @type {boolean}
   */
  this.accessDenied = accessDenied;

  /**
   * @type {boolean}
   */
  this.configMode = configMode;

  /**
   * @type {boolean}
   */
  this.bootloader = bootloader;
}

/**
 * @param {Array.<boolean>} status
 * @returns {ResponseStatus}
 */
ResponseStatus.fromArray = function(status)
{
  return new ResponseStatus(
    status[0],
    status[1],
    status[2],
    status[3],
    status[4],
    status[5],
    status[6],
    status[7]
  );
};
