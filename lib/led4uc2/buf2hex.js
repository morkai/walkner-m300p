// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

/**
 * @param {Buffer|Array.<number>} buffer
 * @returns {string}
 */
module.exports = function buf2hex(buffer)
{
  if (!Buffer.isBuffer(buffer) && !Array.isArray(buffer))
  {
    return '';
  }

  var hex = [];

  for (var i = 0, l = buffer.length; i < l; ++i)
  {
    if (buffer[i] < 0x10)
    {
      hex.push('0' + buffer[i].toString(16));
    }
    else
    {
      hex.push(buffer[i].toString(16));
    }
  }

  return hex.join(' ');
};
