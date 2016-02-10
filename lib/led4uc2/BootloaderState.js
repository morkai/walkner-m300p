// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

/**
 * @enum {string}
 */
var BootloaderState = {
  INACTIVE: 0,
  READY: 1,
  PROGRAMMING_ERROR: 2,
  ERASING: 3,
  ERASING_ERROR: 4,
  PROGRAMMING: 5
};

Object.defineProperty(BootloaderState, 'toString', {
  value: function(value)
  {
    switch (value)
    {
      case 0: return 'INACTIVE';
      case 1: return 'READY';
      case 2: return 'PROGRAMMING_ERROR';
      case 3: return 'ERASING';
      case 4: return 'ERASING_ERROR';
      case 5: return 'PROGRAMMING';
      default: return null;
    }
  }
});

module.exports = BootloaderState;
