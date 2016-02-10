// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var ErrorCodeResponse = require('./ErrorCodeResponse');

module.exports = GoToApp;

/**
 * @constructor
 * @extends {Order}
 */
function GoToApp()
{
  Order.call(this, '3', ErrorCodeResponse);
}

inherits(GoToApp, Order);
