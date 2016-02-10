// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

module.exports = Config;

/**
 * @constructor
 * @param {Config.Pir} pir
 * @param {number} maxLampPower
 * @param {Config.Dls} dls
 * @param {Config.Blinking} selectingBlinking
 * @param {Config.Blinking} warningBlinking
 * @param {number} fixedLevel
 * @param {Config.WorkMode} workMode
 * @param {number} dlsSetValue
 */
function Config(pir, maxLampPower, dls, selectingBlinking, warningBlinking, fixedLevel, workMode, dlsSetValue)
{
  if (!(pir instanceof Config.Pir))
  {
    throw new Error('The `pir` must be an instance of `Config.Pir`.');
  }

  if (typeof maxLampPower !== 'number' || maxLampPower < 0 || maxLampPower > 100)
  {
    throw new Error('The `maxLampPower` must be a number between 0.0 and 100.');
  }

  if (!(dls instanceof Config.Dls))
  {
    throw new Error('The `dls` must be an instance of `Config.Dls`.');
  }

  if (!(selectingBlinking instanceof Config.Blinking))
  {
    throw new Error('The `selectingBlinking` must be an instance of `Config.Blinking`.');
  }

  if (!(warningBlinking instanceof Config.Blinking))
  {
    throw new Error('The `warningBlinking` must be an instance of `Config.Blinking`.');
  }

  if (typeof fixedLevel !== 'number' || maxLampPower < 0 || maxLampPower > 100)
  {
    throw new Error('The `fixedLevel` must be a number between 0.0 and 100.');
  }

  if (Config.WorkMode.toString(workMode) === null)
  {
    throw new Error(
      'The `workMode` must be one of the following `Config.WorkMode` values: '
      + Object.keys(Config.WorkMode).join(', ') + '.'
    );
  }

  if (typeof dlsSetValue !== 'number' || dlsSetValue < 0 || dlsSetValue > 0xFFFF)
  {
    throw new Error('The `dlsSetValue` must be an uint16.');
  }

  /**
   * @type {Config.Pir}
   */
  this.pir = pir;

  /**
   * @type {number}
   */
  this.maxLampPower = maxLampPower;

  /**
   * @type {Config.Dls}
   */
  this.dls = dls;

  /**
   * @type {Config.Blinking}
   */
  this.selectingBlinking = selectingBlinking;

  /**
   * @type {Config.Blinking}
   */
  this.warningBlinking = warningBlinking;

  /**
   * @type {number}
   */
  this.fixedLevel = fixedLevel;

  /**
   * @type {Config.WorkMode}
   */
  this.workMode = workMode;

  /**
   * @type {number}
   */
  this.dlsSetValue = dlsSetValue;
}

/**
 * @param {BufferReader} bufferReader
 * @returns {Config}
 */
Config.fromBufferReader = function(bufferReader)
{
  bufferReader.shiftByte();

  return new Config(
    Config.Pir.fromBufferReader(bufferReader),
    bufferReader.shiftUInt8(),
    Config.Dls.fromBufferReader(bufferReader),
    Config.Blinking.fromBufferReader(bufferReader),
    Config.Blinking.fromBufferReader(bufferReader),
    bufferReader.shiftUInt16(true) / 10,
    bufferReader.shiftUInt8(),
    bufferReader.shiftUInt16(true)
  );
};

/**
 * @param {object} obj
 * @param {object} obj.pir
 * @param {number} obj.pir.onLevel
 * @param {number} obj.pir.dimLevel
 * @param {number} obj.pir.fadeIn
 * @param {number} obj.pir.fadeOut
 * @param {number} obj.pir.delay
 * @param {number} obj.pir.flag
 * @param {number} obj.pir.sensitivity
 * @param {number} obj.maxLampPower
 * @param {object} obj.dls
 * @param {number} obj.dls.onLevel
 * @param {number} obj.dls.dimLevel
 * @param {number} obj.dls.fadeIn
 * @param {number} obj.dls.fadeOut
 * @param {number} obj.dls.delay
 * @param {number} obj.dls.flag
 * @param {number} obj.dls.onThreshold
 * @param {number} obj.dls.offThreshold
 * @param {object} obj.selectingBlinking
 * @param {number} obj.selectingBlinking.timeOn
 * @param {number} obj.selectingBlinking.timeOff
 * @param {number} obj.selectingBlinking.pulses
 * @param {object} obj.warningBlinking
 * @param {number} obj.warningBlinking.timeOn
 * @param {number} obj.warningBlinking.timeOff
 * @param {number} obj.warningBlinking.pulses
 * @param {number} obj.fixedLevel
 * @param {number|string} obj.workMode
 * @param {number} obj.dlsSetValue
 * @returns {Config}
 * @throws {Error} If any property is invalid.
 */
Config.fromObject = function(obj)
{
  return new Config(
    Config.Pir.fromObject(obj.pir),
    obj.maxLampPower,
    Config.Dls.fromObject(obj.dls),
    Config.Blinking.fromObject(obj.selectingBlinking),
    Config.Blinking.fromObject(obj.warningBlinking),
    obj.fixedLevel,
    typeof obj.workMode === 'string' ? Config.WorkMode[obj.workMode.toUpperCase()] : obj.workMode,
    obj.dlsSetValue
  );
};

/**
 * @returns {object}
 */
Config.prototype.inspect = function()
{
  return {
    pir: this.pir,
    maxLampPower: this.maxLampPower,
    dls: this.dls,
    selectingBlinking: this.selectingBlinking,
    warningBlinking: this.warningBlinking,
    fixedLevel: this.fixedLevel,
    workMode: Config.WorkMode.toString(this.workMode),
    dlsSetValue: this.dlsSetValue
  };
};

/**
 * @returns {Buffer}
 */
Config.prototype.encodeData = function()
{
  var dataBuffer = new Buffer(40);
  var i = 0;

  dataBuffer[i++] = 0;

  i = this.pir.encodeData(dataBuffer, i);

  dataBuffer.writeUInt8(this.maxLampPower, i++);

  i = this.dls.encodeData(dataBuffer, i);
  i = this.selectingBlinking.encodeData(dataBuffer, i);
  i = this.warningBlinking.encodeData(dataBuffer, i);

  dataBuffer.writeUInt16LE(Math.round(this.fixedLevel * 10), i);
  i += 2;

  dataBuffer[i++] = this.workMode;

  dataBuffer.writeUInt16LE(this.dlsSetValue, i);

  return dataBuffer;
};

/**
 * @enum {string}
 */
Config.WorkMode = {
  FIX: 0,
  PIR: 1,
  DLS: 2,
  SCHW: 3,
  SCHD: 4,
  DLS_FOLLOWER: 5,
  DLS_PIR: 6
};

Object.defineProperty(Config.WorkMode, 'toString', {
  value: function(value)
  {
    switch (value)
    {
      case 0: return 'FIX';
      case 1: return 'PIR';
      case 2: return 'DLS';
      case 3: return 'SCHW';
      case 4: return 'SCHD';
      case 5: return 'DLS_FOLLOWER';
      case 6: return 'DLS_PIR';
      default: return null;
    }
  }
});

/**
 * @constructor
 * @param {number} onLevel
 * @param {number} dimLevel
 * @param {number} fadeIn
 * @param {number} fadeOut
 * @param {number} delay
 * @param {number} flag
 * @param {number} sensitivity
 */
Config.Pir = function(onLevel, dimLevel, fadeIn, fadeOut, delay, flag, sensitivity)
{
  if (typeof onLevel !== 'number' || onLevel < 0 || onLevel > 100)
  {
    throw new Error('The `Config.Pir.onLevel` must be a number between 0.0 and 100.');
  }

  if (typeof dimLevel !== 'number' || dimLevel < 0 || dimLevel > 100)
  {
    throw new Error('The `Config.Pir.dimLevel` must be a number between 0.0 and 100.');
  }

  if (typeof fadeIn !== 'number' || fadeIn < 0 || fadeIn > 0xFFFF)
  {
    throw new Error('The `Config.Pir.fadeIn` must be an uint16.');
  }

  if (typeof fadeOut !== 'number' || fadeOut < 0 || fadeOut > 0xFFFF)
  {
    throw new Error('The `Config.Pir.fadeOut` must be an uint16.');
  }

  if (typeof delay !== 'number' || delay < 0 || delay > 0xFFFF)
  {
    throw new Error('The `Config.Pir.delay` must be an uint16.');
  }

  if (typeof flag !== 'number' || flag < 0 || flag > 0xFF)
  {
    throw new Error('The `Config.Pir.flag` must be an uint8.');
  }

  if (typeof sensitivity !== 'number'
    || sensitivity < -127
    || sensitivity > 127
    || sensitivity.toString().indexOf('.') !== -1)
  {
    throw new Error('The `Config.Pir.sensitivity` must be a sint8.');
  }

  /**
   * @type {number}
   */
  this.onLevel = onLevel;

  /**
   * @type {number}
   */
  this.dimLevel = dimLevel;

  /**
   * @type {number}
   */
  this.fadeIn = fadeIn;

  /**
   * @type {number}
   */
  this.fadeOut = fadeOut;

  /**
   * @type {number}
   */
  this.delay = delay;

  /**
   * @type {number}
   */
  this.flag = flag;

  /**
   * @type {number}
   */
  this.sensitivity = Math.floor(sensitivity);
};

/**
 * @param {BufferReader} bufferReader
 * @returns {Config.Pir}
 */
Config.Pir.fromBufferReader = function(bufferReader)
{
  return new Config.Pir(
    bufferReader.shiftUInt16(true) / 10,
    bufferReader.shiftUInt16(true) / 10,
    bufferReader.shiftUInt16(true) / 10,
    bufferReader.shiftUInt16(true) / 10,
    bufferReader.shiftUInt16(true) / 10,
    bufferReader.shiftUInt8(),
    bufferReader.shiftInt8()
  );
};

/**
 * @param {object} obj
 * @param {number} obj.onLevel
 * @param {number} obj.dimLevel
 * @param {number} obj.fadeIn
 * @param {number} obj.fadeOut
 * @param {number} obj.delay
 * @param {number} obj.flag
 * @param {number} obj.sensitivity
 * @returns {Config.Pir}
 * @throws {Error} If any property is invalid.
 */
Config.Pir.fromObject = function(obj)
{
  return new Config.Pir(
    obj.onLevel,
    obj.dimLevel,
    obj.fadeIn,
    obj.fadeOut,
    obj.delay,
    obj.flag,
    obj.sensitivity
  );
};

/**
 * @param {Buffer} dataBuffer
 * @param {number} i
 * @returns {number}
 */
Config.Pir.prototype.encodeData = function(dataBuffer, i)
{
  dataBuffer.writeUInt16LE(Math.round(this.onLevel * 10), i);
  i += 2;
  dataBuffer.writeUInt16LE(Math.round(this.dimLevel * 10), i);
  i += 2;
  dataBuffer.writeUInt16LE(Math.round(this.fadeIn * 10), i);
  i += 2;
  dataBuffer.writeUInt16LE(Math.round(this.fadeOut * 10), i);
  i += 2;
  dataBuffer.writeUInt16LE(Math.round(this.delay * 10), i);
  i += 2;
  dataBuffer.writeUInt8(this.flag, i);
  i += 1;
  dataBuffer.writeInt8(this.sensitivity, i);
  i += 1;

  return i;
};

/**
 * @constructor
 * @param {number} onLevel
 * @param {number} dimLevel
 * @param {number} fadeIn
 * @param {number} fadeOut
 * @param {number} delay
 * @param {number} flag
 * @param {number} onThreshold
 * @param {number} offThreshold
 */
Config.Dls = function(onLevel, dimLevel, fadeIn, fadeOut, delay, flag, onThreshold, offThreshold)
{
  if (typeof onLevel !== 'number' || onLevel < 0 || onLevel > 100)
  {
    throw new Error('The `Config.Dls.onLevel` must be a number between 0.0 and 100.');
  }

  if (typeof dimLevel !== 'number' || dimLevel < 0 || dimLevel > 100)
  {
    throw new Error('The `Config.Dls.dimLevel` must be a number between 0.0 and 100.');
  }

  if (typeof fadeIn !== 'number' || fadeIn < 0 || fadeIn > 0xFFFF)
  {
    throw new Error('The `Config.Dls.fadeIn` must be an uint16.');
  }

  if (typeof fadeOut !== 'number' || fadeOut < 0 || fadeOut > 0xFFFF)
  {
    throw new Error('The `Config.Dls.fadeOut` must be an uint16.');
  }

  if (typeof delay !== 'number' || delay < 0 || delay > 0xFFFF)
  {
    throw new Error('The `Config.Dls.delay` must be an uint16.');
  }

  if (typeof flag !== 'number' || flag < 0 || flag > 0xFF)
  {
    throw new Error('The `Config.Dls.flag` must be an uint8.');
  }

  if (typeof onThreshold !== 'number' || onThreshold < 0 || onThreshold > 0xFFFF)
  {
    throw new Error('The `Config.Dls.onThreshold` must be an uint16.');
  }

  if (typeof offThreshold !== 'number' || offThreshold < 0 || offThreshold > 0xFFFF)
  {
    throw new Error('The `Config.Dls.offThreshold` must be an uint16.');
  }

  /**
   * @type {number}
   */
  this.onLevel = onLevel;

  /**
   * @type {number}
   */
  this.dimLevel = dimLevel;

  /**
   * @type {number}
   */
  this.fadeIn = fadeIn;

  /**
   * @type {number}
   */
  this.fadeOut = fadeOut;

  /**
   * @type {number}
   */
  this.delay = delay;

  /**
   * @type {number}
   */
  this.flag = flag;

  /**
   * @type {number}
   */
  this.onThreshold = onThreshold;

  /**
   * @type {number}
   */
  this.offThreshold = offThreshold;
};

/**
 * @param {BufferReader} bufferReader
 * @returns {Config.Dls}
 */
Config.Dls.fromBufferReader = function(bufferReader)
{
  return new Config.Dls(
    bufferReader.shiftUInt16(true) / 10,
    bufferReader.shiftUInt16(true) / 10,
    bufferReader.shiftUInt16(true) / 10,
    bufferReader.shiftUInt16(true) / 10,
    bufferReader.shiftUInt16(true) / 10,
    bufferReader.shiftUInt8(),
    bufferReader.shiftUInt16(true),
    bufferReader.shiftUInt16(true)
  );
};

/**
 * @param {object} obj
 * @param {number} obj.onLevel
 * @param {number} obj.dimLevel
 * @param {number} obj.fadeIn
 * @param {number} obj.fadeOut
 * @param {number} obj.delay
 * @param {number} obj.flag
 * @param {number} obj.onThreshold
 * @param {number} obj.offThreshold
 * @returns {Config.Dls}
 * @throws {Error} If any property is invalid.
 */
Config.Dls.fromObject = function(obj)
{
  return new Config.Dls(
    obj.onLevel,
    obj.dimLevel,
    obj.fadeIn,
    obj.fadeOut,
    obj.delay,
    obj.flag,
    obj.onThreshold,
    obj.offThreshold
  );
};

/**
 * @param {Buffer} dataBuffer
 * @param {number} i
 * @returns {number}
 */
Config.Dls.prototype.encodeData = function(dataBuffer, i)
{
  dataBuffer.writeUInt16LE(Math.round(this.onLevel * 10), i);
  i += 2;
  dataBuffer.writeUInt16LE(Math.round(this.dimLevel * 10), i);
  i += 2;
  dataBuffer.writeUInt16LE(Math.round(this.fadeIn * 10), i);
  i += 2;
  dataBuffer.writeUInt16LE(Math.round(this.fadeOut * 10), i);
  i += 2;
  dataBuffer.writeUInt16LE(Math.round(this.delay * 10), i);
  i += 2;
  dataBuffer.writeUInt8(this.flag, i);
  i += 1;
  dataBuffer.writeUInt16LE(this.onThreshold, i);
  i += 2;
  dataBuffer.writeUInt16LE(this.offThreshold, i);
  i += 2;

  return i;
};

/**
 * @constructor
 * @param {number} timeOn
 * @param {number} timeOff
 * @param {number} pulses
 */
Config.Blinking = function(timeOn, timeOff, pulses)
{
  if (typeof timeOn !== 'number' || timeOn < 0 || timeOn > 25.5)
  {
    throw new Error('The `Config.Blinking.timeOn` must be a number between 0.0 and 25.5.');
  }

  if (typeof timeOff !== 'number' || timeOff < 0 || timeOff > 25.5)
  {
    throw new Error('The `Config.Blinking.timeOff` must be a number between 0.0 and 25.5.');
  }

  if (typeof pulses !== 'number' || pulses < 0 || pulses > 255)
  {
    throw new Error('The `Config.Blinking.pulses` must be a number between 0 and 255.');
  }

  /**
   * @type {number}
   */
  this.timeOn = timeOn;

  /**
   * @type {number}
   */
  this.timeOff = timeOff;

  /**
   * @type {number}
   */
  this.pulses = pulses;
};

/**
 * @param {BufferReader} bufferReader
 * @returns {Config.Blinking}
 */
Config.Blinking.fromBufferReader = function(bufferReader)
{
  return new Config.Blinking(
    bufferReader.shiftUInt8() / 10,
    bufferReader.shiftUInt8() / 10,
    bufferReader.shiftUInt8()
  );
};

/**
 * @param {object} obj
 * @param {number} obj.timeOn
 * @param {number} obj.timeOff
 * @param {number} obj.pulses
 * @returns {Config.Blinking}
 * @throws {Error} If any property is invalid.
 */
Config.Blinking.fromObject = function(obj)
{
  return new Config.Blinking(obj.timeOn, obj.timeOff, obj.pulses);
};

/**
 * @param {Buffer} dataBuffer
 * @param {number} i
 * @returns {number}
 */
Config.Blinking.prototype.encodeData = function(dataBuffer, i)
{
  dataBuffer.writeUInt8(Math.round(this.timeOn * 10), i++);
  dataBuffer.writeUInt8(Math.round(this.timeOff * 10), i++);
  dataBuffer.writeUInt8(this.pulses, i++);

  return i;
};
