// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var Response = require('../Response');

module.exports = TextResponse;

/**
 * @constructor
 * @extends {Response}
 * @param {number} address
 * @param {number} requestId
 * @param {string} code
 * @param {ResponseStatus} status
 * @param {Buffer} data
 */
function TextResponse(address, requestId, code, status, data)
{
  Response.apply(this, arguments);

  var zeroIndex = -1;

  for (var i = 0; i < data.length; ++i)
  {
    if (data[i] === 0)
    {
      zeroIndex = i;

      break;
    }
  }

  /**
   * @type {string}
   */
  this.text = zeroIndex === 0
    ? ''
    : zeroIndex === -1
      ? data.toString('ascii')
      : data.toString('ascii', 0, zeroIndex);
}

inherits(TextResponse, Response);

/**
 * @returns {object}
 */
TextResponse.prototype.inspect = function()
{
  var obj = Response.prototype.inspect.call(this);

  obj.text = this.text;

  return obj;
};
