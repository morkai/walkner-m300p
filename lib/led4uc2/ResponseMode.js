// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

/**
 * @enum {string}
 */
var ResponseMode = {
  DIRECT: 0,
  INDIRECT: 1
};

Object.defineProperty(ResponseMode, 'toString', {
  value: function(value)
  {
    switch (value)
    {
      case 0: return 'DIRECT';
      case 1: return 'INDIRECT';
      default: return null;
    }
  }
});

module.exports = ResponseMode;
