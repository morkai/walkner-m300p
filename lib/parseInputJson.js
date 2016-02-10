// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var glp2 = require('glp2');
var led4uc2 = require('./led4uc2');
var convertIptJson = require('./convertIptJson');

module.exports = function parseInputJson(ctx, inputJson)
{
  var input;

  try
  {
    input = JSON.parse(inputJson);
  }
  catch (err)
  {
    throw {
      reason: 'INPUT_JSON_PARSE_FAILURE',
      error: {
        message: err.message,
        code: err.code || null
      }
    };
  }

  if (typeof input !== 'object' || input === null)
  {
    throw {
      reason: 'INVALID_INPUT_TYPE',
      data: {
        requiredType: 'object',
        actualType: input === null ? 'null' : typeof input
      }
    };
  }

  if (isIptInput(input))
  {
    try
    {
      input = convertIptJson(input);
    }
    catch (err)
    {
      throw {
        reason: 'IPT_JSON_CONVERSION_FAILURE',
        error: err
      };
    }
  }

  var config = typeof input.config === 'object' && input.config !== null ? input.config : {};

  validateConfigProperty({
    propertyName: 'deviceMac',
    requiredValue: '00:00:00:00:00:00',
    validator: function(v) { return typeof v !== 'string' || !/^([0-9a-f]{2}:?){5}[0-9a-f]{2}$/i.test(v); }
  });

  ctx.config.deviceMac = ctx.config.deviceMac.match(/([0-9a-f]{2})/ig).join(':');

  validateConfigProperty({
    propertyName: 'devicePin',
    requiredValue: 'a [0-9]{4} string',
    validator: function(v) { return typeof v !== 'string' || !/^[0-9]{4}$/.test(v); }
  });
  validateConfigProperty({
    propertyName: 'userPassword',
    defaultValue: '0000',
    requiredValue: 'a [0-9]{4} string',
    validator: function(v) { return typeof v !== 'string' || !/^[0-9]{4}$/.test(v); }
  });
  validateConfigProperty({
    propertyName: 'factoryPassword',
    defaultValue: input.program ? null : '000000',
    requiredValue: 'a [0-9]{6} string',
    validator: function(v) { return typeof v !== 'string' || !/^[0-9]{6}$/.test(v); }
  });
  validateConfigProperty({
    propertyName: 'loginHashSeed',
    defaultValue: input.program ? null : 0,
    requiredValue: 'an unsigned 32-bit integer',
    validator: function(v) { return typeof v !== 'number' || v < 0 || v > 0xFFFFFFFF; }
  });
  validateConfigProperty({
    propertyName: 'responseTimeout',
    defaultValue: 500,
    requiredValue: 'a number between 10 and 1000',
    validator: function(v) { return typeof v !== 'number' || v < 10 || v > 1000; }
  });
  validateConfigProperty({
    propertyName: 'btConnectDelay',
    defaultValue: 10000,
    requiredValue: 'a number greater than or equal to 1',
    validator: function(v) { return typeof v !== 'number' || v < 1; }
  });
  validateConfigProperty({
    propertyName: 'progressInterval',
    defaultValue: 200,
    requiredValue: 'a number greater than or equal to 100',
    validator: function(v) { return typeof v !== 'number' || v < 100; }
  });
  validateConfigProperty({
    propertyName: 'testerComPort',
    defaultValue: 'COM1',
    requiredValue: 'a valid COM port',
    validator: function(v) { return typeof v !== 'string' || v.length < 4; }
  });
  validateConfigProperty({
    propertyName: 'logging',
    defaultValue: {error: false, conn: true, txrx: false, reqres: true},
    requiredValue: {error: 'boolean', conn: 'boolean', txrx: 'boolean', reqres: 'boolean'},
    validator: function(v) { return typeof v !== 'object' || v === null; }
  });

  if (input.program)
  {
    createProgramOrders(ctx.program, input.program);
  }

  if (input.test)
  {
    ctx.test.glp2 = createGlp2TestStep(input.test.glp2);
    ctx.test.m300 = createM300TestOrder(input.test.m300);
  }

  function overrideConfigProperty(propertyName, defaultValue)
  {
    if (ctx.config[propertyName] != null)
    {
      config[propertyName] = ctx.config[propertyName];
    }

    if (config[propertyName] == null)
    {
      config[propertyName] = defaultValue;
    }

    return config[propertyName];
  }

  function validateConfigProperty(options)
  {
    var actualValue = overrideConfigProperty(options.propertyName, options.defaultValue);

    if (options.validator(actualValue))
    {
      throwInvalidPropertyError('config.' + options.propertyName, options.requiredValue, actualValue);
    }

    ctx.config[options.propertyName] = actualValue;
  }
};

function isIptInput(input)
{
  if (!input.program)
  {
    return false;
  }

  if (typeof input.program.textInfoSet !== 'undefined')
  {
    return true;
  }

  if (input.program.config && typeof input.program.config.pirAct !== 'undefined')
  {
    return true;
  }

  if (input.program.factoryParameters && typeof input.program.factoryParameters.factoryDlsOn !== 'undefined')
  {
    return true;
  }

  return false;
}

function throwInvalidPropertyError(propertyName, requiredValue, actualValue)
{
  throw {
    reason: 'INVALID_INPUT_PROPERTY',
    data: {
      propertyName: propertyName,
      requiredValue: requiredValue,
      actualValue: typeof actualValue === 'undefined' ? null : actualValue
    }
  };
}

function createProgramOrders(output, input)
{
  createOrderFromObject(output, input, 'nameAndNumber', 'SetNameAndNumber');
  createOrderFromValue(output, input, 'textInfo', 'SetTextInfo');
  createOrderFromValue(output, input, 'serialNumber', 'SetSerialNumber');
  createOrderFromObject(output, input, 'config', 'SetConfig');
  createOrderFromObject(output, input, 'factoryParameters', 'SetFactoryParameters');
  createScheduleFromObject(output, input);
}

function createGlp2TestStep(input)
{
  /* eslint no-new:0 */

  var options = {
    type: 'fn',
    enabled: 1,
    step: 1,
    execution: 0,
    range: 0,
    voltage: 0,
    correction: 0,
    leaveOn: 0,
    uTolerance: 0,
    retries: 0,
    cancelOnFailure: 1,
    visMode: 0,
    goInput: 0,
    noGoInput: 0,
    rsvChannel: 0,
    rsvNumber: 1,
    multi: 0,
    label: 'M300P',
    mode: 2,
    startTime: 1800,
    duration: 1800,
    setValue: 1,
    lowerToleranceRel: 100,
    upperToleranceRel: 100,
    lowerToleranceAbs: 0,
    upperToleranceAbs: 0,
    trigger: 0
  };

  Object.keys(input || {}).forEach(function(k)
  {
    options[k] = input[k];
  });

  try
  {
    new glp2.FctTest(options);
  }
  catch (err)
  {
    throw {
      reason: 'INVALID_INPUT_PROPERTY',
      data: {
        propertyName: 'test.glp2',
        actualValue: input
      },
      error: err
    };
  }

  return options;
}

function createM300TestOrder(input)
{
  if (typeof input !== 'object' || input === null)
  {
    throwInvalidPropertyError(
      'test.m300',
      {
        leadInTime: '0.0-30',
        fadeInTime: '0.0-30',
        highLevel: '0.0-100',
        highTime: '0.0-30',
        fadeOutTime: '0.0-30',
        lowLevel: '0.0-100',
        shutDown: 'boolean',
        leadOutTime: '0.0-30'
      },
      input
    );
  }

  try
  {
    return led4uc2.orders.SetFixPreview.fromObject(input);
  }
  catch (err)
  {
    throw {
      reason: 'INVALID_INPUT_PROPERTY',
      data: {
        propertyName: 'test.m300',
        actualValue: input
      },
      error: err
    };
  }
}

function createOrderFromObject(output, input, propertyName, orderName)
{
  var obj = input[propertyName];

  if (typeof obj === 'undefined')
  {
    return;
  }

  if (typeof obj !== 'object' || obj === null)
  {
    throwInvalidPropertyError('program.' + propertyName, 'an object', obj);
  }

  try
  {
    output[propertyName] = led4uc2.orders[orderName].fromObject(obj);
  }
  catch (err)
  {
    throw {
      reason: 'INVALID_INPUT_PROPERTY',
      data: {
        propertyName: 'program.' + propertyName,
        actualValue: obj
      },
      error: err
    };
  }
}

function createOrderFromValue(output, input, propertyName, orderName)
{
  var value = input[propertyName];

  if (typeof value === 'undefined')
  {
    return;
  }

  try
  {
    output[propertyName] = new led4uc2.orders[orderName](value);
  }
  catch (err)
  {
    throw {
      reason: 'INVALID_INPUT_PROPERTY',
      data: {
        propertyName: 'program.' + propertyName,
        actualValue: value
      },
      error: err
    };
  }
}

function createScheduleFromObject(output, input)
{
  var obj = input.schedule;

  if (typeof obj === 'undefined')
  {
    return;
  }

  if (typeof obj !== 'object' || obj === null)
  {
    throwInvalidPropertyError('program.schedule', 'an object', obj);
  }

  var days = Object.keys(obj);

  if (days.length === 0)
  {
    return;
  }

  var schedule = [];

  for (var i = 0; i < days.length; ++i)
  {
    var k = days[i];
    var day = k.toUpperCase();

    if (typeof led4uc2.DailySchedule.Day[day] === 'undefined')
    {
      throw {
        reason: 'INVALID_INPUT_PROPERTY',
        data: {
          propertyName: 'program.schedule.*',
          requiredValue: Object.keys(led4uc2.DailySchedule.Day).join(', '),
          actualValue: day
        }
      };
    }

    try
    {
      schedule.push(led4uc2.orders.SetSchedulerConfig.fromObject({
        day: day,
        schedule: obj[k]
      }));
    }
    catch (err)
    {
      throw {
        reason: 'INVALID_INPUT_PROPERTY',
        data: {
          propertyName: 'program.schedule.' + day,
          actualValue: obj[k]
        },
        error: err
      };
    }
  }

  output.schedule = schedule;
}
