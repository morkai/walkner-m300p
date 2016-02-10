// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

module.exports = DailySchedule;

/**
 * @constructor
 * @param {number} hours
 * @param {number} minutes
 * @param {DailySchedule.Func} func
 * @param {number} level
 */
function DailySchedule(hours, minutes, func, level)
{
  if (typeof hours !== 'number' || hours < 0 || hours > 23)
  {
    throw new Error('The `DailySchedule.hours` must be a number between 0 and 23.');
  }

  if (typeof minutes !== 'number' || minutes < 0 || minutes > 59)
  {
    throw new Error('The `DailySchedule.minutes` must be a number between 0 and 59.');
  }

  if (DailySchedule.Func.toString(func) === null)
  {
    throw new Error(
      'The `DailySchedule.func` must be one of the following `DailySchedule.Func` values: '
      + Object.keys(DailySchedule.Func).join(', ') + '.'
    );
  }

  if (typeof level !== 'number' || level < 0 || level > 100)
  {
    throw new Error('The `DailySchedule.level` must be a number between 0 and 100.');
  }

  /**
   * @type {number}
   */
  this.hours = hours;

  /**
   * @type {number}
   */
  this.minutes = minutes;

  /**
   * @type {DailySchedule.Func}
   */
  this.func = func;

  /**
   * @type {number}
   */
  this.level = level;
}

/**
 * @enum {number}
 */
DailySchedule.Day = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
  DAY: 7
};

Object.defineProperty(DailySchedule.Day, 'toString', {
  value: function(value)
  {
    switch (value)
    {
      case 0: return 'SUN';
      case 1: return 'MON';
      case 2: return 'TUE';
      case 3: return 'WED';
      case 4: return 'THU';
      case 5: return 'FRI';
      case 6: return 'SAT';
      case 7: return 'DAY';
      default: return null;
    }
  }
});

/**
 * @enum {number}
 */
DailySchedule.Func = {
  NULL: 0,
  PIR: 1,
  DLS: 2,
  OFF: 3,
  FIX: 4,
  DLS_REG: 5
};

Object.defineProperty(DailySchedule.Func, 'toString', {
  value: function(value)
  {
    switch (value)
    {
      case 0: return 'NULL';
      case 1: return 'PIR';
      case 2: return 'DLS';
      case 3: return 'OFF';
      case 4: return 'FIX';
      case 5: return 'DLS_REG';
      default: return null;
    }
  }
});

/**
 * @param {BufferReader} bufferReader
 * @returns {DailySchedule}
 */
DailySchedule.fromBufferReader = function(bufferReader)
{
  return new DailySchedule(
    bufferReader.shiftByte(),
    bufferReader.shiftByte(),
    bufferReader.shiftByte(),
    bufferReader.shiftByte()
  );
};

/**
 * @param {object} obj
 * @param {number} obj.hours
 * @param {number} obj.minutes
 * @param {number|string} obj.func
 * @param {number} obj.level
 * @returns {DailySchedule}
 * @throws {Error} If any property is invalid.
 */
DailySchedule.fromObject = function(obj)
{
  return new DailySchedule(
    obj.hours,
    obj.minutes,
    typeof obj.func === 'string' ? DailySchedule.Func[obj.func.toUpperCase()] : obj.func,
    obj.level
  );
};

/**
 * @returns {object}
 */
DailySchedule.prototype.inspect = function()
{
  return {
    hours: this.hours,
    minutes: this.minutes,
    func: DailySchedule.Func.toString(this.func),
    level: this.level
  };
};
