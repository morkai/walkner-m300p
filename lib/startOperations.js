// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var BT_UNPAIR_EXE = __dirname + '/../bin/BtCmdTools/BtUnpair.exe';
var BT_CONF_EXE = __dirname + '/../bin/BtCmdTools/BtAuth.exe';
var BT_CHANNEL = 1;

var util = require('./util');
var spawn = require('child_process').spawn;
var step = require('h5.step');
var glp2 = require('glp2');
var led4uc2 = require('./led4uc2');
var Glp2Manager = require('./Glp2Manager');
var program = require('./program');
var testGlp2 = require('./testGlp2');
var testM300 = require('./testM300');
var read = require('./read');
var cleanUp = require('./cleanUp');

module.exports = function startOperations(ctx, done)
{
  var READY_TIMEOUT = 10000;

  var hasProgram = Object.keys(ctx.program).length !== 0;
  var hasTest = Object.keys(ctx.test).length !== 0;
  var glp2Error = null;
  var clientOpened = false;

  ctx.progress.reset();
  ctx.progress.operations.program.enabled = hasProgram;
  ctx.progress.operations.test.enabled = hasTest;
  ctx.progress.operations.read.enabled = !hasProgram && !hasTest;

  ctx.result = {};

  util.log('Connecting...');

  step(
    function setUpGlp2ManagerStep()
    {
      if (!hasTest)
      {
        return;
      }

      ctx.manager = createGlp2Manager();
      ctx.manager.getDeviceOptions = function() {};

      var nextStep = util.once(this.next());

      ctx.manager.once('ready', nextStep);
      ctx.manager.once('error', nextStep);
      ctx.manager.once('close', nextStep);
      setTimeout(nextStep, READY_TIMEOUT);

      if (ctx.config.logging.conn)
      {
        util.log('[glp2#starting]');
      }

      ctx.manager.start();
    },
    function checkTesterReadinessStep()
    {
      if (ctx.manager && !ctx.manager.isReady())
      {
        return this.skip('GLP2:TESTER_NOT_READY');
      }

      ctx.progress.complete('setup', 'glp2:start');
    },
    function createBtConnectionStep()
    {
      ctx.client = createBtClient(createBtTransport(createBtConnection()));
    },
    function spawnBtConfStep()
    {
      if (ctx.config.logging.conn)
      {
        util.log('[BtConf#starting]');
      }

      spawnBtConf(util.once(this.next()));
    },
    function startGlp2TestStep()
    {
      ctx.progress.complete('setup', 'bt:conf');

      if (!ctx.manager)
      {
        return;
      }

      var next = util.once(this.next());
      var nextTimer = setTimeout(next, ctx.config.btConnectDelay);

      this.cancelGlp2 = testGlp2(ctx, function(err)
      {
        if (err)
        {
          if (clientOpened && err !== 'CANCELLED')
          {
            if (typeof err === 'string')
            {
              util.log('[glp2#error] %s', err);
            }
            else
            {
              util.log('[glp2#error] %s: %s', err.code, err.message);
            }
          }

          glp2Error = err;

          clearTimeout(nextTimer);
          setImmediate(next);
        }
      });
    },
    function connectToDeviceStep()
    {
      if (glp2Error)
      {
        return this.skip(glp2Error);
      }

      ctx.progress.complete('setup', 'bt:delay');

      clientOpened = true;

      ctx.client.open(this.next());
    },
    function handleConnectToDeviceResultStep(err)
    {
      if (err)
      {
        return this.skip({
          reason: 'BT_CONNECT_FAILURE',
          data: {
            deviceMac: ctx.config.deviceMac,
            devicePin: ctx.config.devicePin
          },
          error: err
        });
      }

      ctx.progress.complete('setup', 'bt:connect');
    },
    function programStep()
    {
      if (hasProgram)
      {
        program(ctx, this.next());
      }
    },
    function handleProgramResultStep(err)
    {
      if (err)
      {
        return this.skip(err);
      }

      ctx.progress.update('program', 100);
    },
    function testStep()
    {
      if (hasTest)
      {
        testM300(ctx, this.next());
      }
    },
    function handleTestResultStep(err)
    {
      if (err)
      {
        return this.skip(err);
      }

      ctx.progress.update('test', 100);
    },
    function readStep()
    {
      if (!hasProgram && !hasTest)
      {
        read(ctx, this.next());
      }
    },
    function handleReadResultStep(err)
    {
      if (err)
      {
        return this.skip(err);
      }

      ctx.progress.update('read', 100);
    },
    function finalizeStep(err)
    {
      if (this.cancelGlp2)
      {
        this.cancelGlp2();
        this.cancelGlp2 = null;
      }

      if (err)
      {
        if (typeof err === 'string')
        {
          err = {
            reason: err
          };
        }
        else if (!err.reason)
        {
          err = {
            reason: 'TESTING_FAILURE',
            error: err
          };
        }
      }

      cleanUp(ctx, function()
      {
        ctx.progress.update('cleanup', 100);

        done(err);
      });
    }
  );

  function createGlp2Manager()
  {
    var manager = new Glp2Manager({
      comPort: ctx.config.testerComPort,
      comAddress: 0x01,
      cancelDelay: 1
    });

    manager.on('error', function(err)
    {
      if (err.message !== 'CANCELLED')
      {
        util.log('[glp2#error] %s', err.message);
      }
    });

    if (ctx.config.logging.conn)
    {
      manager.on('open', function() { util.log('[glp2#open]'); });
      manager.on('close', function() { util.log('[glp2#close]'); });
      manager.on('ready', function() { util.log('[glp2#ready]'); });
    }

    if (ctx.config.logging.txrx)
    {
      manager.on('tx', function(buffer) { util.log('[glp2#tx] %s', glp2.prettifyBuffer(buffer)); });
      manager.on('rx', function(buffer) { util.log('[glp2#rx] %s', glp2.prettifyBuffer(buffer)); });
    }

    return manager;
  }

  function createBtConnection()
  {
    var connection = new led4uc2.Connection(ctx.config.deviceMac, {
      unpairExe: BT_UNPAIR_EXE,
      channel: BT_CHANNEL
    });

    if (ctx.config.logging.conn)
    {
      connection.on('unpairing', function(e) { util.log('[led4uc2#unpairing] %s', e); });
      connection.on('unpairingFailed', function(err) { util.log('[led4uc2#unpairingFailed] %s', err.message); });
      connection.on('unpaired', function() { util.log('[led4uc2#unpaired]'); });
      connection.on('opening', function(e) { util.log('[led4uc2#opening] %s', e); });
      connection.on('openingFailed', function(err) { util.log('[led4uc2#openingFailed] %s', err.message); });
      connection.on('opened', function() { util.log('[led4uc2#opened]'); });
      connection.on('closing', function() { util.log('[led4uc2#closing]'); });
      connection.on('closed', function() { util.log('[led4uc2#closed]'); });
    }

    if (ctx.config.logging.txrx)
    {
      connection.on('data', function(buf) { util.log('[led4uc2#data] %s', util.buf2hex(buf)); });
      connection.on('writing', function(buf) { util.log('[led4uc2#writing] %s', util.buf2hex(buf)); });
      connection.on('writingFailed', function(buf) { util.log('[led4uc2#writingFailed] %s', util.buf2hex(buf)); });
      connection.on('written', function(bytesWritten) { util.log('[led4uc2#written] %d bytes', bytesWritten); });
    }

    return connection;
  }

  function createBtTransport(connection)
  {
    var transport = new led4uc2.Transport(connection, {
      responseTimeoutDelay: ctx.config.responseTimeout
    });

    transport.on('dataIgnored', function(e)
    {
      if (!ctx.config.logging.txrx)
      {
        return;
      }

      var err = null;

      if (e.reason === 'INVALID_RESPONSE')
      {
        err = e.actual;
        e.actual = 'Error...';
      }

      util.log('[led4uc2#dataIgnored] %s', e);

      if (err)
      {
        console.log(err);
      }
    });

    if (ctx.config.logging.reqres)
    {
      transport.on('request', function(req) { util.log('[led4uc2#request] %s', req); });
      transport.on('response', function(req, res) { util.log('[led4uc2#response] %s', res); });
    }

    return transport;
  }

  function createBtClient(transport)
  {
    var client = new led4uc2.Client(transport, {
      loginHashSeed: ctx.config.loginHashSeed
    });

    client.on('error', function(err)
    {
      if (ctx.config.logging.conn && err.message !== 'Error reading from connection')
      {
        util.log('[led4uc2#error] %s', err.message);
      }
    });

    return client;
  }

  function spawnBtConf(next)
  {
    var deviceName = ctx.config.deviceMac.substring(10).replace(/:/g, '');

    ctx.btConf = spawn(BT_CONF_EXE, [
      deviceName,
      ctx.config.devicePin
    ]);

    ctx.btConf.once('error', function(err)
    {
      if (ctx.config.logging.conn)
      {
        util.log('[BtConf#error] %s', err.message);
      }

      next();
    });

    ctx.btConf.once('close', function(exitCode)
    {
      ctx.btConf = null;

      if (ctx.config.logging.conn)
      {
        if (exitCode)
        {
          util.log('[BtConf#closed] code=%s', exitCode);
        }
        else
        {
          util.log('[BtConf#closed]');
        }
      }

      next();
    });

    ctx.btConf.stdout.setEncoding('utf8');
    ctx.btConf.stdout.on('data', function(stdout)
    {
      if (ctx.config.logging.conn)
      {
        util.log('[BtConf] %s', stdout.trim().replace(/\t+/g, ' '));
      }

      if (/006\s+Radio/.test(stdout))
      {
        next();
      }
    });
  }
};
