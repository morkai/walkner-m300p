// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

/* eslint-disable no-process-exit, no-shadow */

'use strict';

var STARTED_AT = Date.now();
var VALID_CONFIG_PROPERTIES = {
  deviceMac: '00:00:00:00:00:00',
  devicePin: '0000',
  userPassword: '0000',
  factoryPassword: '000000',
  loginHashSeed: 0,
  responseTimeout: 500,
  btConnectDelay: 2000,
  btConnectTryCount: 1,
  progressInterval: 200,
  testerComPort: 'COM1',
  logging: {
    error: false,
    conn: true,
    txrx: false,
    reqres: true
  }
};

var util = require('./util');

util.log('Starting...');

var fs = require('fs');
var url = require('url');
var parseInputJson = require('./parseInputJson');
var startOperations = require('./startOperations');
var progress = require('./progress');

var ctx = {
  /** @type led4uc2.Client */
  client: null,
  btConf: null,
  manager: null,
  httpRequests: 0,
  httpResponse: null,
  input: '',
  config: {
    deviceMac: null,
    devicePin: null,
    userPassword: null,
    factoryPassword: null,
    loginHashSeed: null,
    responseTimeout: null,
    btConnectDelay: null,
    btConnectTryCount: null,
    progressInterval: null,
    testerComPort: null,
    logging: null
  },
  glp2Progress: {},
  program: {
    nameAndNumber: null,
    textInfo: null,
    serialNumber: null,
    config: null,
    factoryParameters: null,
    schedule: null
  },
  test: {
    m300: {
      leadInTime: null,
      fadeInTime: null,
      highLevel: null,
      highTime: null,
      fadeOutTime: null,
      lowLevel: null,
      shutDown: null,
      leadOutTime: null
    },
    glp2: {}
  },
  progress: progress,
  result: {}
};

ctx.config = {};
ctx.program = {};
ctx.test = {};

for (var argI = 2; argI < process.argv.length; ++argI)
{
  parseArgValue(parseArgName(process.argv[argI++]), process.argv[argI]);
}

var inputFile = null;
var serverAddr = null;
var serverPort = null;

if (/\.json/i.test(ctx.input))
{
  inputFile = ctx.input;
}
else if (/^[0-9]{2,5}$/.test(ctx.input))
{
  serverAddr = '127.0.0.1';
  serverPort = parseInt(ctx.input, 10);
}
else if (/^([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})(?::([0-9]{2,5}))?$/.test(ctx.input))
{
  var serverParts = ctx.input.split(':');

  serverAddr = serverParts[0];
  serverPort = parseInt(serverParts[1], 10) || 1337;
}

if (ctx.input === '-')
{
  util.log('Reading input from stdin...');

  process.stdin.setEncoding('utf8');
  process.stdin.resume();

  process.stdin.on('data', function(json)
  {
    process.stdin.pause();

    try
    {
      parseInputJson(ctx, json);
    }
    catch (err)
    {
      exit(err);
    }

    startOperations(ctx, exit);
  });
}
else if (inputFile !== null)
{
  util.log('Reading input from file: %s', inputFile);

  try
  {
    parseInputFile(inputFile);
  }
  catch (err)
  {
    exit(err);
  }

  startOperations(ctx, exit);
}
else if (serverAddr !== null)
{
  util.log('Reading input from HTTP requests...');

  var http = require('http');
  var server = http.createServer();

  server.on('request', function(req, res)
  {
    res.startedAt = Date.now();
    res.requestId = ++ctx.httpRequests;

    util.log('[httpServer#request] %d', res.requestId);

    req.on('error', function() {});

    if (ctx.httpResponse !== null)
    {
      return exit({reason: 'HTTP_SERVER:BUSY'}, 429, res);
    }

    ctx.httpResponse = res;

    var query = url.parse(req.url, true).query;
    var argNames = Object.keys(query);

    for (var i = 0; i < argNames.length; ++i)
    {
      parseArgValue(parseArgName(argNames[i]), query[argNames[i]]);
    }

    if (req.method !== 'POST')
    {
      return exit({
        reason: 'HTTP_SERVER:INVALID_REQUEST_METHOD',
        data: {
          requiredMethod: 'POST',
          actualMethod: req.method
        }
      }, 405);
    }

    parseInputRequest(req);
  });

  server.on('error', function(err)
  {
    util.log('[httpServer#error] %s', err.message);
  });

  server.on('close', function()
  {
    util.log('[httpServer#close]');

    ctx.httpResponse = null;

    exit({
      reason: 'SERVER_CLOSED'
    });
  });

  server.on('listening', function()
  {
    util.log('[httpServer#listening] port=%d addr=%s', serverPort, serverAddr);
  });

  server.listen(serverPort, serverAddr);
}
else
{
  try
  {
    parseInputJson(ctx, '{}');
  }
  catch (err)
  {
    exit(err);
  }

  startOperations(ctx, exit);
}

function exit(err, statusCode, res)
{
  if (!res && ctx.httpResponse)
  {
    res = ctx.httpResponse;
    ctx.httpResponse = null;
  }

  if (res && !statusCode)
  {
    statusCode = err ? 400 : 200;
  }

  var startedAt = res ? res.startedAt : STARTED_AT;
  var elapsedTime = ((Date.now() - startedAt) / 1000).toFixed(3);

  if (err)
  {
    var prettyError = JSON.stringify({
      reason: err.reason,
      data: err.data || null,
      error: !err.error ? null : {
        message: err.error[ctx.config.logging && ctx.config.logging.error ? 'stack' : 'message'],
        code: err.error.code || null
      }
    }, null, 2);

    if (res)
    {
      util.log('[httpServer] Request %d finished in %ds with an error: %s', res.requestId, elapsedTime, prettyError);

      res.writeHead(statusCode, {
        'Content-Type': 'application/json'
      });
      res.end(prettyError);
    }
    else
    {
      util.log('Finished in %ds with an error: %s', elapsedTime, err.reason);
      console.log(prettyError);
      process.exit(1);
    }
  }
  else
  {
    var prettyResult = JSON.stringify(ctx.result, null, 2);

    if (res)
    {
      util.log('[httpServer] Request %d finished in %ds!', res.requestId, elapsedTime);

      res.writeHead(statusCode, {
        'Content-Type': 'application/json'
      });
      res.end(prettyResult);
    }
    else
    {
      util.log('Finished in %ds!', elapsedTime);
      console.log(prettyResult);
      process.exit(0);
    }
  }
}

function parseInputFile(inputFile)
{
  var json;

  try
  {
    json = fs.readFileSync(inputFile, 'utf8');
  }
  catch (err)
  {
    throw {
      reason: 'INPUT_FILE_READ_FAILURE',
      data: {
        inputFile: inputFile
      },
      error: {
        message: err.message,
        code: err.code
      }
    };
  }

  return parseInputJson(ctx, json);
}

function parseInputRequest(req)
{
  var json = '';

  req.on('data', function(chunk)
  {
    json += chunk;
  });

  req.on('end', function()
  {
    try
    {
      parseInputJson(ctx, json);
    }
    catch (err)
    {
      return exit(err);
    }

    startOperations();
  });
}

function parseArgName(name)
{
  return name
    .trim()
    .replace(/^-+/, '')
    .split('-')
    .filter(function(part) { return part.length > 0; })
    .map(function(part, i) { return part[0][i === 0 ? 'toLowerCase' : 'toUpperCase']() + part.substring(1); })
    .join('');
}

function parseArgValue(name, value)
{
  if (name === 'input')
  {
    ctx.input = (value || '').trim();
  }
  else if (name === 'logging')
  {
    var enabled = value.toLowerCase().split(',');

    ctx.config.logging = {};

    Object.keys(VALID_CONFIG_PROPERTIES.logging).forEach(function(key)
    {
      ctx.config.logging[key] = enabled.indexOf(key) !== -1;
    });
  }
  else if (typeof VALID_CONFIG_PROPERTIES[name] === 'undefined')
  {
    exit({
      reason: 'UNKNOWN_ARGUMENT',
      data: {
        allowedArgumentNames: ['input'].concat(Object.keys(VALID_CONFIG_PROPERTIES)).join(', '),
        actualArgumentName: name
      }
    });
  }
  else if (typeof VALID_CONFIG_PROPERTIES[name] === 'number')
  {
    var numericValue = parseInt(value, 10);

    if (isNaN(numericValue))
    {
      exit({
        reason: 'INVALID_ARGUMENT_TYPE',
        data: {
          argumentName: name,
          requiredType: 'number',
          actualType: typeof value,
          actualValue: value
        }
      });
    }

    ctx.config[name] = numericValue;
  }
  else
  {
    ctx.config[name] = value.trim();
  }
}

