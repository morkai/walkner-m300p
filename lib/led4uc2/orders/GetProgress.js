// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var GetProgressResponse = require('./GetProgressResponse');

module.exports = GetProgress;

/**
 * @constructor
 * @extends {Order}
 */
function GetProgress()
{
  Order.call(this, 'p', GetProgressResponse);
}

inherits(GetProgress, Order);
