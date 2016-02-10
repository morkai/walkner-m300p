// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

/**
 * @param {BufferReader} bufferReader
 * @returns {Date}
 */
module.exports = function shiftDate(bufferReader)
{
  var s = bufferReader.shiftUInt8();
  var i = bufferReader.shiftUInt8();
  var h = bufferReader.shiftUInt8();
  var D = bufferReader.shiftUInt8();
  var M = bufferReader.shiftUInt8();
  var Y = bufferReader.shiftInt8();

  return new Date(Y + 2000, M - 1, D, h, i, s);
};
