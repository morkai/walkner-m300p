// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

/**
 * @enum {string}
 */
var LoginLevel = {
  NONE: 0,
  USER: 1,
  FACTORY: 2
};

Object.defineProperty(LoginLevel, 'toString', {
  value: function(value)
  {
    switch (value)
    {
      case 0: return 'NONE';
      case 1: return 'USER';
      case 2: return 'FACTORY';
      default: return null;
    }
  }
});

module.exports = LoginLevel;
