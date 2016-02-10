// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var GetConfigResponse = require('./GetConfigResponse');

module.exports = GetConfig;

/**
 * @constructor
 * @extends {Order}
 */
function GetConfig()
{
  Order.call(this, 'q', GetConfigResponse);
}

inherits(GetConfig, Order);

/**
 * @returns {Buffer}
 */
GetConfig.prototype.encodeData = function()
{
  return new Buffer([
    0
  ]);
};
