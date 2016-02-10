// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

/**
 * @enum {string}
 */
var EmergencyMode = {
  ON: 0,
  OFF: 1,
  DISABLED: 2
};

Object.defineProperty(EmergencyMode, 'toString', {
  value: function(value)
  {
    switch (value)
    {
      case 0: return 'ON';
      case 1: return 'OFF';
      case 2: return 'DISABLED';
      default: return null;
    }
  }
});

module.exports = EmergencyMode;
