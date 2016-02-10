// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Order = require('../Order');
var TextResponse = require('./TextResponse');

module.exports = GetTextInfo;

/**
 * @constructor
 * @extends {Order}
 */
function GetTextInfo()
{
  Order.call(this, 't', TextResponse);
}

inherits(GetTextInfo, Order);

