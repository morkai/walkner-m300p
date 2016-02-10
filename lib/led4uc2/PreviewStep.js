// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

/**
 * @enum {number}
 */
var PreviewStep = {
  DISABLED: 0,
  LEAD_IN: 1,
  FADE_IN: 2,
  HIGH_LEVEL: 3,
  FADE_OUT: 4,
  LEAD_OUT: 5
};

Object.defineProperty(PreviewStep, 'toString', {
  value: function(value)
  {
    switch (value)
    {
      case 0: return 'DISABLED';
      case 1: return 'LEAD_IN';
      case 2: return 'FADE_IN';
      case 3: return 'HIGH_LEVEL';
      case 4: return 'FADE_OUT';
      case 5: return 'LEAD_OUT';
      default: return null;
    }
  }
});

module.exports = PreviewStep;
