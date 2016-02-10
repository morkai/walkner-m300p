// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var orders = require('./orders');

module.exports = Client;

/**
 * @constructor
 * @extends {EventEmitter}
 * @param {Transport} transport
 * @param {object} [options]
 * @param {number} [options.loginHashSeed]
 */
function Client(transport, options)
{
  EventEmitter.call(this);

  if (!options)
  {
    options = {};
  }

  /**
   * @type {Transport}
   */
  this.transport = transport;

  /**
   * @type {Connection}
   */
  this.connection = transport.connection;

  /**
   * @private
   * @type {number}
   */
  this.loginHashSeed = options.loginHashSeed || 0x12345678;

  [
    'error',
    'pairing', 'pairingFailed', 'paired',
    'unpairing', 'unpairingFailed', 'unpaired',
    'opening', 'openingFailed', 'opened',
    'data',
    'writing', 'writingFailed', 'written',
    'closing', 'closed'
  ].forEach(
    function(eventType) { this.connection.on(eventType, this.emit.bind(this, eventType)); },
    this
  );

  [
    'request', 'response',
    'dataIgnored'
  ].forEach(
    function(eventType) { this.transport.on(eventType, this.emit.bind(this, eventType)); },
    this
  );
}

util.inherits(Client, EventEmitter);

/**
 * @returns {boolean}
 */
Client.prototype.isPaired = function()
{
  return this.connection.isPaired();
};

/**
 * @param {boolean} force
 * @param {function((Error|null), string, string)} [done]
 */
Client.prototype.pair = function(force, done)
{
  this.connection.pair(force, done);
};

/**
 * @param {boolean} all
 * @param {function((Error|null), string, string)} [done]
 */
Client.prototype.unpair = function(all, done)
{
  this.connection.unpair(all, done);
};

/**
 * @returns {boolean}
 */
Client.prototype.isOpen = function()
{
  return this.connection.isOpen();
};

/**
 * @param {function((Error|null))} [done]
 */
Client.prototype.open = function(done)
{
  this.connection.open(done);
};

Client.prototype.close = function()
{
  this.connection.close();
};

/**
 * @param {Order} order
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.send = function(order, responseHandler)
{
  this.transport.send(order, responseHandler);
};

/**
 * @param {function((Error|null), (GetTaskBufferResponse|null))} responseHandler
 */
Client.prototype.getTaskBuffer = function(responseHandler)
{
  this.send(new orders.GetTaskBuffer(), responseHandler);
};

/**
 * @param {number} timeOn
 * @param {number} timeOff
 * @param {number} pulseCount
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.setBlinking = function(timeOn, timeOff, pulseCount, responseHandler)
{
  var order = new orders.SetBlinking(timeOn, timeOff, pulseCount);

  this.send(order, responseHandler);
};

/**
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.setBlinkingWarning = function(responseHandler)
{
  this.send(new orders.SetBlinkingWarning(), responseHandler);
};

/**
 * @param {function((Error|null), (GetRtcResponse|null))} responseHandler
 */
Client.prototype.getRtc = function(responseHandler)
{
  this.send(new orders.GetRtc(), responseHandler);
};

/**
 * @param {Date} date
 * @param {boolean} autoDst
 * @param {function((Error|null), (GetRtcResponse|null))} responseHandler
 */
Client.prototype.setRtc = function(date, autoDst, responseHandler)
{
  var order = new orders.SetRtc(date, autoDst);

  this.send(order, responseHandler);
};

/**
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.setResetFlag = function(responseHandler)
{
  this.send(new orders.SetResetFlag(), responseHandler);
};

/**
 * @param {DailySchedule.Day|string} day
 * @param {function((Error|null), (GetSchedulerConfigResponse|null))} responseHandler
 */
Client.prototype.getSchedulerConfig = function(day, responseHandler)
{
  var order = new orders.GetSchedulerConfig(day);

  this.send(order, responseHandler);
};

/**
 * @param {DailySchedule.Day|string} day
 * @param {Array.<DailySchedule>} schedule
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.setSchedulerConfig = function(day, schedule, responseHandler)
{
  var order = new orders.SetSchedulerConfig(day, schedule);

  this.send(order, responseHandler);
};

/**
 * @param {function((Error|null), (GetEmergencyModeResponse|null))} responseHandler
 */
Client.prototype.getEmergencyMode = function(responseHandler)
{
  this.send(new orders.GetEmergencyMode(), responseHandler);
};

/**
 * @param {EmergencyMode|string} emergencyMode
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.setEmergencyMode = function(emergencyMode, responseHandler)
{
  var order = new orders.SetEmergencyMode(emergencyMode);

  this.send(order, responseHandler);
};

/**
 * @param {number} leadIn
 * @param {number} fadeInTime
 * @param {number} highLevel
 * @param {number} highTime
 * @param {number} fadeOutTime
 * @param {number} lowLevel
 * @param {boolean} shutDown
 * @param {number} leadOut
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.setPirPreview = function(
  leadIn, fadeInTime, highLevel, highTime, fadeOutTime, lowLevel, shutDown, leadOut, responseHandler)
{
  var order = new orders.SetPirPreview(
    leadIn, fadeInTime, highLevel, highTime, fadeOutTime, lowLevel, shutDown, leadOut
  );

  this.send(order, responseHandler);
};

/**
 * @param {number} leadIn
 * @param {number} fadeInTime
 * @param {number} highLevel
 * @param {number} highTime
 * @param {number} fadeOutTime
 * @param {number} lowLevel
 * @param {boolean} shutDown
 * @param {number} leadOut
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.setDlsPreview = function(
  leadIn, fadeInTime, highLevel, highTime, fadeOutTime, lowLevel, shutDown, leadOut, responseHandler)
{
  var order = new orders.SetDlsPreview(
    leadIn, fadeInTime, highLevel, highTime, fadeOutTime, lowLevel, shutDown, leadOut
  );

  this.send(order, responseHandler);
};

/**
 * @param {number} leadIn
 * @param {number} fadeInTime
 * @param {number} highLevel
 * @param {number} highTime
 * @param {number} fadeOutTime
 * @param {number} lowLevel
 * @param {boolean} shutDown
 * @param {number} leadOut
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.setFixPreview = function(
  leadIn, fadeInTime, highLevel, highTime, fadeOutTime, lowLevel, shutDown, leadOut, responseHandler)
{
  var order = new orders.SetFixPreview(
    leadIn, fadeInTime, highLevel, highTime, fadeOutTime, lowLevel, shutDown, leadOut
  );

  this.send(order, responseHandler);
};

/**
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.stopPreview = function(responseHandler)
{
  var order = new orders.SetFixPreview(0, 0, 0, 0, 0, 0, false, 0);

  this.send(order, responseHandler);
};

/**
 * @param {boolean} lampOnOff
 * @param {number} onTime
 * @param {number} offTime
 * @param {number} num
 * @param {number} period
 * @param {number} highLevel
 * @param {number} lowLevel
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.setSelectionPulse = function(
  lampOnOff, onTime, offTime, num, period, highLevel, lowLevel, responseHandler)
{
  var order = new orders.SetSelectionPulse(lampOnOff, onTime, offTime, num, period, highLevel, lowLevel);

  this.send(order, responseHandler);
};

/**
 * @param {number} syncValue
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.setKeepAlive = function(syncValue, responseHandler)
{
  var order = new orders.SetKeepAlive(syncValue);

  this.send(order, responseHandler);
};

/**
 * @param {function((Error|null), (GetNameAndNumberResponse|null))} responseHandler
 */
Client.prototype.getNameAndNumber = function(responseHandler)
{
  this.send(new orders.GetNameAndNumber(), responseHandler);
};

/**
 * @param {string} name
 * @param {number} number
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.setNameAndNumber = function(name, number, responseHandler)
{
  var order = new orders.SetNameAndNumber(name, number);

  this.send(order, responseHandler);
};

/**
 * @param {function((Error|null), (GetConfigResponse|null))} responseHandler
 */
Client.prototype.getConfig = function(responseHandler)
{
  this.send(new orders.GetConfig(), responseHandler);
};

/**
 * @param {Config} config
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.setConfig = function(config, responseHandler)
{
  var order = new orders.SetConfig(config);

  this.send(order, responseHandler);
};

/**
 * @param {function((Error|null), (GetStatusResponse|null))} responseHandler
 */
Client.prototype.getStatus = function(responseHandler)
{
  this.send(new orders.GetStatus(), responseHandler);
};

/**
 * @param {function((Error|null), (GetVersionResponse|null))} responseHandler
 */
Client.prototype.getVersion = function(responseHandler)
{
  this.send(new orders.GetVersion(), responseHandler);
};

/**
 * @param {function((Error|null), (GetInfoResponse|null))} responseHandler
 */
Client.prototype.getInfo = function(responseHandler)
{
  this.send(new orders.GetInfo(), responseHandler);
};

/**
 * @param {number} lampCount
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.programShortAddress = function(lampCount, responseHandler)
{
  var order = new orders.ProgramShortAddress(lampCount);

  this.send(order, responseHandler);
};

/**
 * @param {number} driverAddress
 * @param {number} mainBank
 * @param {number} subBank
 * @param {number} offset
 * @param {number} byteCount
 * @param {function((Error|null), (GetDriverParametersResponse|null))} responseHandler
 */
Client.prototype.getDriverParameters = function(driverAddress, mainBank, subBank, offset, byteCount, responseHandler)
{
  var order = new orders.GetDriverParameters(driverAddress, mainBank, subBank, offset, byteCount);

  this.send(order, responseHandler);
};

/**
 * @param {number} programSize
 * @param {function((Error|null), (ErrorCodeResponse|null))} responseHandler
 */
Client.prototype.startProgramming = function(programSize, responseHandler)
{
  var order = new orders.StartProgramming(programSize);

  this.send(order, responseHandler);
};

/**
 * @param {ProgramData.AddressType} addressType
 * @param {number} startingAddress
 * @param {Buffer} data
 * @param {function((Error|null), (ErrorCodeResponse|null))} responseHandler
 */
Client.prototype.programData = function(addressType, startingAddress, data, responseHandler)
{
  var order = new orders.ProgramData(addressType, startingAddress, data);

  this.send(order, responseHandler);
};

/**
 * @param {function((Error|null), (ErrorCodeResponse|null))} responseHandler
 */
Client.prototype.goToApp = function(responseHandler)
{
  this.send(new orders.GoToApp(), responseHandler);
};

/**
 * @param {function((Error|null), (GetBootStatusResponse|null))} responseHandler
 */
Client.prototype.getBootStatus = function(responseHandler)
{
  this.send(new orders.GetBootStatus(), responseHandler);
};

/**
 * @param {number|Buffer|Array.<Buffer>} checksumOrProgramData
 * @param {function((Error|null), (ErrorCodeResponse|null))} responseHandler
 */
Client.prototype.finishProgramming = function(checksumOrProgramData, responseHandler)
{
  var order = new orders.FinishProgramming(checksumOrProgramData);

  this.send(order, responseHandler);
};

/**
 * @param {function((Error|null), (ErrorCodeResponse|null))} responseHandler
 */
Client.prototype.verifyApp = function(responseHandler)
{
  this.send(new orders.VerifyApp(), responseHandler);
};

/**
 * @param {function((Error|null), (BootloaderActiveResponse|null))} responseHandler
 */
Client.prototype.bootloaderActive = function(responseHandler)
{
  this.send(new orders.BootloaderActive(), responseHandler);
};

/**
 * @param {number} maxWaitTime
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.goToBootloader = function(maxWaitTime, responseHandler)
{
  var order = new orders.GoToBootloader(maxWaitTime);

  this.send(order, responseHandler);
};

/**
 * @param {function((Error|null), (ErrorCodeResponse|null))} responseHandler
 */
Client.prototype.setAppOk = function(responseHandler)
{
  this.send(new orders.SetAppOk(), responseHandler);
};

/**
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.clearAllErrors = function(responseHandler)
{
  this.send(new orders.ClearAllErrors(), responseHandler);
};

/**
 * @param {function((Error|null), (GetFactoryParametersResponse|null))} responseHandler
 */
Client.prototype.getFactoryParameters = function(responseHandler)
{
  this.send(new orders.GetFactoryParameters(), responseHandler);
};

/**
 * @param {boolean|null} dlsEnabled
 * @param {boolean|null} pirEnabled,
 * @param {number|null} lensType,
 * @param {number|null} daliMinLevel,
 * @param {number|null} startDelay,
 * @param {number|null} rtcCalibration,
 * @param {number|null} pirSensitivity,
 * @param {number|null} dlsCalibration
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.setFactoryParameters = function(
  dlsEnabled,
  pirEnabled,
  lensType,
  daliMinLevel,
  startDelay,
  rtcCalibration,
  pirSensitivity,
  dlsCalibration,
  responseHandler)
{
  var order = new orders.SetFactoryParameters(
    dlsEnabled,
    pirEnabled,
    lensType,
    daliMinLevel,
    startDelay,
    rtcCalibration,
    pirSensitivity,
    dlsCalibration
  );

  this.send(order, responseHandler);
};

/**
 * @param {function((Error|null), (GetDatesResponse|null))} responseHandler
 */
Client.prototype.getDates = function(responseHandler)
{
  this.send(new orders.GetDates(), responseHandler);
};

/**
 * @param {function((Error|null), (TextResponse|null))} responseHandler
 */
Client.prototype.getTextInfo = function(responseHandler)
{
  this.send(new orders.GetTextInfo(), responseHandler);
};

/**
 * @param {string} text
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.setTextInfo = function(text, responseHandler)
{
  var order = new orders.SetTextInfo(text);

  this.send(order, responseHandler);
};

/**
 * @param {function((Error|null), (GetSecureLoginDataResponse|null))} responseHandler
 */
Client.prototype.getSecureLoginData = function(responseHandler)
{
  this.send(new orders.GetSecureLoginData(), responseHandler);
};

/**
 * @param {Buffer} secretKey
 * @param {string} password
 * @param {number|null} hashSeed
 * @param {function((Error|null), (ErrorCodeResponse|null))} responseHandler
 */
Client.prototype.factoryLogin = function(secretKey, password, hashSeed, responseHandler)
{
  var order = new orders.FactoryLogin(
    secretKey,
    password,
    hashSeed === null ? this.loginHashSeed : hashSeed
  );

  this.send(order, responseHandler);
};

/**
 * @param {string} password
 * @param {function((Error|null), (ErrorCodeResponse|null))} responseHandler
 */
Client.prototype.userLogin = function(password, responseHandler)
{
  var order = new orders.UserLogin(password);

  this.send(order, responseHandler);
};

/**
 * @param {LoginLevel} loginLevel
 * @param {string} oldPassword
 * @param {string} newPassword
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.setPassword = function(loginLevel, oldPassword, newPassword, responseHandler)
{
  var order = new orders.SetPassword(loginLevel, oldPassword, newPassword);

  this.send(order, responseHandler);
};

/**
 * @param {function((Error|null), (GetProgressResponse|null))} responseHandler
 */
Client.prototype.getProgress = function(responseHandler)
{
  this.send(new orders.GetProgress(), responseHandler);
};

/**
 * @param {function((Error|null), (Response|null))} responseHandler
 */
Client.prototype.resetMaxPirValue = function(responseHandler)
{
  this.send(new orders.ResetMaxPirValue(), responseHandler);
};

/**
 * @param {number} atCommand
 * @param {function((Error|null), (TextResponse|null))} responseHandler
 */
Client.prototype.getBluetoothInfo = function(atCommand, responseHandler)
{
  var order = new orders.GetBluetoothInfo(atCommand);

  this.send(order, responseHandler);
};

/**
 * @param {function((Error|null), (TextResponse|null))} responseHandler
 */
Client.prototype.getBluetoothMac = function(responseHandler)
{
  this.send(new orders.GetBluetoothMac(), responseHandler);
};

/**
 * @param {function((Error|null), (TextResponse|null))} responseHandler
 */
Client.prototype.getSerialNumber = function(responseHandler)
{
  this.send(new orders.GetSerialNumber(), responseHandler);
};

/**
 * @param {string} serialNumber
 * @param {function((Error|null), (TextResponse|null))} responseHandler
 */
Client.prototype.setSerialNumber = function(serialNumber, responseHandler)
{
  var order = new orders.SetSerialNumber(serialNumber);

  this.send(order, responseHandler);
};

/**
 * @param {function((Error|null), (ErrorCodeResponse|null))} responseHandler
 */
Client.prototype.getSelfTest = function(responseHandler)
{
  this.send(new orders.GetSelfTest(), responseHandler);
};
