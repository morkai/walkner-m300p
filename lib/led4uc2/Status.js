// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var shiftDate = require('./shiftDate');
var Config = require('./Config');
var LoginLevel = require('./LoginLevel');

module.exports = Status;

/**
 * @constructor
 * @param {number} avgIlluminance
 * @param {number} lightLevel
 * @param {number} errorFlag
 * @param {number} resetErrors
 * @param {number} rtcErrors
 * @param {number} pcbTemp
 * @param {LoginLevel} loginLevel
 * @param {number} tmpIlluminance
 * @param {Status.WorkMode} workMode
 * @param {number} driversNum
 * @param {number} resetsNum
 * @param {number} resetTime
 * @param {Status.ResetReason} resetReason
 * @param {number} maxPir
 * @param {Status.Times} times
 * @param {number} pirDetections
 * @param {number} dlsDetections
 * @param {number} maxPcbTemp
 * @param {number} minPcbTemp
 * @param {Config.WorkMode} configuredWorkMode
 * @param {Date} configChangeDate
 * @param {Array.<number>} energyConsumed
 */
function Status(
  avgIlluminance,
  lightLevel,
  errorFlag,
  resetErrors,
  rtcErrors,
  pcbTemp,
  loginLevel,
  tmpIlluminance,
  workMode,
  driversNum,
  resetsNum,
  resetTime,
  resetReason,
  maxPir,
  times,
  pirDetections,
  dlsDetections,
  maxPcbTemp,
  minPcbTemp,
  configuredWorkMode,
  configChangeDate,
  energyConsumed)
{
  /**
   * @type {number}
   */
  this.avgIlluminance = avgIlluminance;

  /**
   * @type {number}
   */
  this.lightLevel = lightLevel;

  /**
   * @type {number}
   */
  this.errorFlag = errorFlag;

  /**
   * @type {number}
   */
  this.resetErrors = resetErrors;

  /**
   * @type {number}
   */
  this.rtcErrors = rtcErrors;

  /**
   * @type {number}
   */
  this.pcbTemp = pcbTemp;

  /**
   * @type {LoginLevel}
   */
  this.loginLevel = loginLevel;

  /**
   * @type {number}
   */
  this.tmpIlluminance = tmpIlluminance;

  /**
   * @type {Status.WorkMode}
   */
  this.workMode = workMode;

  /**
   * @type {number}
   */
  this.driversNum = driversNum;

  /**
   * @type {number}
   */
  this.resetsNum = resetsNum;

  /**
   * @type {number}
   */
  this.resetTime = resetTime;

  /**
   * @type {Date}
   */
  this.resetDate = new Date(Date.now() - resetTime);

  /**
   * @type {Status.ResetReason}
   */
  this.resetReason = resetReason;

  /**
   * @type {number}
   */
  this.maxPir = maxPir;

  /**
   * @type {Status.Times}
   */
  this.times = times;

  /**
   * @type {number}
   */
  this.pirDetections = pirDetections;

  /**
   * @type {number}
   */
  this.dlsDetections = dlsDetections;

  /**
   * @type {number}
   */
  this.maxPcbTemp = maxPcbTemp;

  /**
   * @type {number}
   */
  this.minPcbTemp = minPcbTemp;

  /**
   * @type {Config.WorkMode}
   */
  this.configuredWorkMode = configuredWorkMode;

  /**
   * @type {Date}
   */
  this.configChangeDate = configChangeDate;

  /**
   * @type {Array.<number>}
   */
  this.energyConsumed = energyConsumed;
}

/**
 * @param {BufferReader} bufferReader
 * @returns {Status}
 */
Status.fromBufferReader = function(bufferReader)
{
  return new Status(
    bufferReader.shiftUInt16(true),
    bufferReader.shiftUInt16(true) / 10,
    bufferReader.shiftUInt32(true),
    bufferReader.shiftUInt32(true),
    bufferReader.shiftUInt32(true),
    bufferReader.shiftInt16(true) / 10,
    bufferReader.shiftUInt8(),
    bufferReader.shiftUInt16(true),
    bufferReader.shiftUInt8(),
    bufferReader.shiftUInt8(),
    bufferReader.shiftUInt16(true),
    bufferReader.shiftUInt32(true),
    bufferReader.shiftUInt8(),
    bufferReader.shiftUInt16(true),
    Status.Times.fromBufferReader(bufferReader),
    bufferReader.shiftUInt32(true),
    bufferReader.shiftUInt32(true),
    bufferReader.shiftInt16(true) / 10,
    bufferReader.shiftInt16(true) / 10,
    bufferReader.shiftUInt8(),
    shiftDate(bufferReader),
    shiftEnergyConsumed(bufferReader)
  );
};

/**
 * @returns {object}
 */
Status.prototype.inspect = function()
{
  return {
    avgIlluminance: this.avgIlluminance,
    lightLevel: this.lightLevel,
    errorFlag: this.errorFlag,
    resetErrors: this.resetErrors,
    rtcErrors: this.rtcErrors,
    pcbTemp: this.pcbTemp,
    loginLevel: LoginLevel.toString(this.loginLevel),
    tmpIlluminance: this.tmpIlluminance,
    workMode: Status.WorkMode.toString(this.workMode),
    driversNum: this.driversNum,
    resetsNum: this.resetsNum,
    resetTime: this.resetTime,
    resetDate: this.resetDate.toISOString(),
    resetReason: Status.ResetReason.toString(this.resetReason),
    maxPir: this.maxPir,
    times: this.times,
    pirDetections: this.pirDetections,
    dlsDetections: this.dlsDetections,
    maxPcbTemp: this.maxPcbTemp,
    minPcbTemp: this.minPcbTemp,
    configuredWorkMode: Config.WorkMode.toString(this.configuredWorkMode),
    configChangeDate: this.configChangeDate.toISOString(),
    energyConsumed: this.energyConsumed
  };
};

/**
 * @enum {string}
 */
Status.ResetReason = {
  AUTO_WATCHDOG: 1,
  WINDOW_WATCHDOG: 2,
  POWER_OFF: 3,
  PROGRAM: 4,
  PROCESSOR_INPUT: 5
};

Object.defineProperty(Status.ResetReason, 'toString', {
  value: function(value)
  {
    switch (value)
    {
      case 1: return 'AUTO_WATCHDOG';
      case 2: return 'WINDOW_WATCHDOG';
      case 3: return 'POWER_OFF';
      case 4: return 'PROGRAM';
      case 5: return 'PROCESSOR_INPUT';
      default: return null;
    }
  }
});

/**
 * @enum {string}
 */
Status.WorkMode = {
  FIX: 0,
  PIR: 1,
  DLS: 2,
  EMERGENCY_ON: 3,
  EMERGENCY_OFF: 4,
  OFF: 5,
  BLINKING: 6,
  FADING_PREVIEW: 7,
  DLS_FOLLOWER: 8,
  DLS_PIR: 9
};

Object.defineProperty(Status.WorkMode, 'toString', {
  value: function(value)
  {
    switch (value)
    {
      case 0: return 'FIX';
      case 1: return 'PIR';
      case 2: return 'DLS';
      case 3: return 'EMERGENCY_ON';
      case 4: return 'EMERGENCY_OFF';
      case 5: return 'OFF';
      case 6: return 'BLINKING';
      case 7: return 'FADING_PREVIEW';
      case 8: return 'DLS_FOLLOWER';
      case 9: return 'DLS_PIR';
      default: return null;
    }
  }
});

/**
 * @constructor
 * @param {Array.<number>} lightLevels
 * @param {number} pir
 * @param {number} dls
 * @param {number} fix
 */
Status.Times = function(lightLevels, pir, dls, fix)
{
  this.lightLevels = {
    L0: lightLevels[0],
    L1_9: lightLevels[1],
    L10_19: lightLevels[2],
    L20_29: lightLevels[3],
    L30_39: lightLevels[4],
    L40_49: lightLevels[5],
    L50_59: lightLevels[6],
    L60_69: lightLevels[7],
    L70_79: lightLevels[8],
    L80_89: lightLevels[9],
    L90_99: lightLevels[10],
    L100: lightLevels[11]
  };

  /**
   * @type {number}
   */
  this.pir = pir;

  /**
   * @type {number}
   */
  this.dls = dls;

  /**
   * @type {number}
   */
  this.fix = fix;
};

/**
 * @param {BufferReader} bufferReader
 * @returns {Status.Times}
 */
Status.Times.fromBufferReader = function(bufferReader)
{
  var lightLevels = new Array(12);

  for (var i = 0; i < 12; ++i)
  {
    lightLevels[i] = bufferReader.shiftUInt32(true);
  }

  return new Status.Times(
    lightLevels,
    bufferReader.shiftUInt32(true),
    bufferReader.shiftUInt32(true),
    bufferReader.shiftUInt32(true)
  );
};

/**
 * @private
 * @param {BufferReader} bufferReader
 * @returns {Array.<number>}
 */
function shiftEnergyConsumed(bufferReader)
{
  var energyConsumed = new Array(8);

  for (var i = 0; i < 8; ++i)
  {
    energyConsumed[i] = bufferReader.shiftUInt32(true);
  }

  return energyConsumed;
}
