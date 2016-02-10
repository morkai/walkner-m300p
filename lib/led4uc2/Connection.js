// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var EventEmitter = require('events').EventEmitter;
var util = require('util');
var exec = require('child_process').exec;
var BluetoothSerialPort = require('bluetooth-serial-port').BluetoothSerialPort;

module.exports = Connection;

/**
 * @constructor
 * @extends {EventEmitter}
 * @param {string} macAddress
 * @param {object} [options]
 * @param {number} [options.channel]
 * @param {string} [options.unpairExe]
 */
function Connection(macAddress, options)
{
  EventEmitter.call(this);

  if (!options)
  {
    options = {};
  }

  /**
   * @private
   * @type {string}
   */
  this.macAddress = macAddress;

  /**
   * @private
   * @type {number}
   */
  this.channel = typeof options.channel === 'number' ? options.channel : 1;

  /**
   * @private
   * @type {string}
   */
  this.unpairExe = typeof options.unpairExe === 'string' ? options.unpairExe : 'BtUnpair';

  /**
   * @private
   * @type {BluetoothSerialPort}
   */
  this.serialPort = new BluetoothSerialPort();
  this.serialPort.close = this.closeSerialPort.bind(this);
  this.serialPort.on('failure', this.emit.bind(this, 'error'));
  this.serialPort.on('data', this.emit.bind(this, 'data'));
}

util.inherits(Connection, EventEmitter);

Connection.prototype.destroy = function()
{
  this.removeAllListeners();
  this.serialPort.removeAllListeners();
  this.serialPort.close();
  this.serialPort = null;
};

/**
 * @param {function((Error|null), string, string)} [done]
 */
Connection.prototype.unpair = function(done)
{
  this.emit('unpairing', {
    macAddress: this.macAddress
  });

  var cmd = util.format('"%s" "%s"', this.unpairExe, this.macAddress);

  exec(cmd, {timeout: 10000}, function(err, stdout, stderr)
  {
    if (err)
    {
      this.emit('unpairingFailed', err, stdout || '', stderr || '');
    }
    else
    {
      this.emit('unpaired');
    }

    if (done)
    {
      done(err, stdout || '', stderr || '');
    }
  }.bind(this));
};

/**
 * @returns {boolean}
 */
Connection.prototype.isOpen = function()
{
  return this.serialPort.isOpen();
};

/**
 * @param {function((Error|null))} [done]
 */
Connection.prototype.open = function(done)
{
  if (this.isOpen())
  {
    if (done)
    {
      setImmediate(done, null);
    }

    return;
  }

  this.emit('opening', {
    macAddress: this.macAddress,
    channel: this.channel
  });

  this.serialPort.connect(this.macAddress, this.channel, onOpened.bind(this), onOpeningFailed.bind(this));

  function onOpened()
  {
    this.emit('opened');

    if (done)
    {
      done(null);
    }
  }

  function onOpeningFailed(err)
  {
    this.emit('openingFailed', err);

    if (done)
    {
      done(err);
    }
  }
};

Connection.prototype.close = function()
{
  this.serialPort.close();
};

/**
 * @param {Buffer} buffer
 * @param {function((Error|null), number)} [done]
 */
Connection.prototype.write = function(buffer, done)
{
  if (!this.isOpen())
  {
    if (done)
    {
      setImmediate(done, new Error('No connection!'));
    }

    return;
  }

  if (buffer.length === 0)
  {
    if (done)
    {
      setImmediate(done, null, 0);
    }

    return;
  }

  this.emit('writing', buffer);

  this.serialPort.write(buffer, function(err, bytesWritten)
  {
    if (err)
    {
      this.emit('writingFailed', err);
    }
    else
    {
      this.emit('written', bytesWritten);
    }

    if (done)
    {
      done(err, bytesWritten);
    }
  }.bind(this));
};

/**
 * @private
 */
Connection.prototype.closeSerialPort = function()
{
  var open = this.isOpen();

  if (open)
  {
    this.emit('closing');
  }

  BluetoothSerialPort.prototype.close.call(this.serialPort);

  if (open)
  {
    this.emit('closed');
  }
};
