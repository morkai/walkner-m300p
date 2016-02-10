// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var step = require('h5.step');
var util = require('./util');
var led4uc2 = require('./led4uc2');

module.exports = function program(ctx, done)
{
  util.log('Programming...');

  step(
    function getVersionStep()
    {
      ctx.client.getVersion(this.next());
    },
    /**
     * @param {(Error|null)} err
     * @param {(GetVersionResponse|null)} res
     */
    function handleGetVersionStep(err, res)
    {
      if (err)
      {
        return this.skip({
          reason: 'GET_VERSION_FAILURE',
          data: {},
          error: err
        });
      }

      util.log('Device version: %s', res.version);

      this.majorVersion = parseInt(res.version.split('.')[0], 10);
    },
    function loginStep()
    {
      if (typeof ctx.program.serialNumber === 'undefined' || ctx.program.factoryParameters)
      {
        util.log('Logging in...');

        login(ctx, this.next());
      }
    },
    function handleLoginStep(err)
    {
      if (err)
      {
        return this.skip(err);
      }
    },
    function startProgrammingStep() {},
    function setNameAndNumberStep()
    {
      if (ctx.program.nameAndNumber)
      {
        util.log('Writing name and number...');

        ctx.client.send(ctx.program.nameAndNumber, this.next());
      }
    },
    /**
     * @param {(Error|null)} err
     */
    function handleSetNameAndNumberStep(err)
    {
      if (err)
      {
        return this.skip({
          reason: 'PROGRAMMING_FAILURE',
          data: {
            propertyName: 'program.nameAndNumber'
          },
          error: err
        });
      }
    },
    function setTextInfoStep()
    {
      if (ctx.program.textInfo)
      {
        util.log('Writing text info...');

        ctx.client.send(ctx.program.textInfo, this.next());
      }
    },
    /**
     * @param {(Error|null)} err
     */
    function handleSetTextInfoStep(err)
    {
      if (err)
      {
        return this.skip({
          reason: 'PROGRAMMING_FAILURE',
          data: {
            propertyName: 'program.textInfo'
          },
          error: err
        });
      }
    },
    function setSerialNumberStep()
    {
      if (ctx.program.serialNumber)
      {
        util.log('Writing serial number...');

        ctx.client.send(ctx.program.serialNumber, this.next());
      }
    },
    /**
     * @param {(Error|null)} err
     */
    function handleSetSerialNumberStep(err)
    {
      if (err)
      {
        return this.skip({
          reason: 'PROGRAMMING_FAILURE',
          data: {
            propertyName: 'program.serialNumber'
          },
          error: err
        });
      }
    },
    function setConfigStep()
    {
      if (ctx.program.config)
      {
        util.log('Writing configuration...');

        ctx.client.send(ctx.program.config, this.next());
      }
    },
    /**
     * @param {(Error|null)} err
     */
    function handleSetConfigStep(err)
    {
      if (err)
      {
        return this.skip({
          reason: 'PROGRAMMING_FAILURE',
          data: {
            propertyName: 'program.config'
          },
          error: err
        });
      }
    },
    function setFactoryParametersStep()
    {
      if (ctx.program.factoryParameters)
      {
        util.log('Writing factory parameters...');

        ctx.client.send(ctx.program.factoryParameters, this.next());
      }
    },
    /**
     * @param {(Error|null)} err
     */
    function handleSetFactoryParametersStep(err)
    {
      if (err)
      {
        return this.skip({
          reason: 'PROGRAMMING_FAILURE',
          data: {
            propertyName: 'program.factoryParameters'
          },
          error: err
        });
      }
    },
    function setScheduleStep()
    {
      if (!ctx.program.schedule)
      {
        return;
      }

      var steps = [];

      ctx.program.schedule.forEach(function(setSchedulerConfig)
      {
        var day = led4uc2.DailySchedule.Day.toString(setSchedulerConfig.day);

        steps.push(function setSchedulerConfigStep()
        {
          util.log('Writing %s schedule...', day);

          ctx.client.send(setSchedulerConfig, this.next());
        });
        steps.push(function handleSetSchedulerConfigStep(err)
        {
          if (err)
          {
            return this.skip({
              reason: 'PROGRAMMING_FAILURE',
              data: {
                propertyName: 'program.schedule.' + day
              },
              error: err
            });
          }
        });
      });

      steps.push(this.next());

      step(steps);
    },
    function startVerificationStep(err)
    {
      if (err)
      {
        return this.skip(err);
      }
    },
    function getNameAndNumberStep()
    {
      if (ctx.program.nameAndNumber)
      {
        util.log('Verifying name and number...');

        ctx.client.getNameAndNumber(this.next());
      }
    },
    /**
     * @param {(Error|null)} err
     * @param {(GetNameAndNumberResponse|null)} res
     */
    function verifyNameAndNumberStep(err, res)
    {
      if (err)
      {
        return this.skip({
          reason: 'VERIFICATION_FAILURE',
          data: {
            propertyName: 'program.nameAndNumber'
          },
          error: err
        });
      }

      if (res.name !== ctx.program.nameAndNumber.name)
      {
        return this.skip({
          reason: 'VERIFICATION_FAILURE',
          data: {
            propertyName: 'program.nameAndNumber.name',
            expectedValue: ctx.program.nameAndNumber.name,
            actualValue: res.name
          }
        });
      }

      if (res.number !== ctx.program.nameAndNumber.number)
      {
        return this.skip({
          reason: 'VERIFICATION_FAILURE',
          data: {
            propertyName: 'program.nameAndNumber.number',
            expectedValue: ctx.program.nameAndNumber.number,
            actualValue: res.number
          }
        });
      }
    },
    function getTextInfoStep()
    {
      if (ctx.program.textInfo)
      {
        util.log('Verifying text info...');

        ctx.client.getTextInfo(this.next());
      }
    },
    /**
     * @param {(Error|null)} err
     * @param {(TextResponse|null)} res
     */
    function verifyTextInfoStep(err, res)
    {
      if (err)
      {
        return this.skip({
          reason: 'VERIFICATION_FAILURE',
          data: {
            propertyName: 'program.textInfo'
          },
          error: err
        });
      }

      if (res.text !== ctx.program.textInfo.text)
      {
        return this.skip({
          reason: 'VERIFICATION_FAILURE',
          data: {
            propertyName: 'program.textInfo',
            expectedValue: ctx.program.textInfo.text,
            actualValue: res.text
          }
        });
      }
    },
    function getSerialNumberStep()
    {
      if (ctx.program.serialNumber)
      {
        util.log('Verifying serial number...');

        ctx.client.getSerialNumber(this.next());
      }
    },
    /**
     * @param {(Error|null)} err
     * @param {(TextResponse|null)} res
     */
    function verifySerialNumberStep(err, res)
    {
      if (err)
      {
        return this.skip({
          reason: 'VERIFICATION_FAILURE',
          data: {
            propertyName: 'program.serialNumber'
          },
          error: err
        });
      }

      if (res.text !== ctx.program.serialNumber.serialNumber)
      {
        return this.skip({
          reason: 'VERIFICATION_FAILURE',
          data: {
            propertyName: 'program.serialNumber',
            expectedValue: ctx.program.serialNumber.serialNumber,
            actualValue: res.text
          }
        });
      }
    },
    function getConfigStep()
    {
      if (ctx.program.config)
      {
        util.log('Verifying configuration...');

        ctx.client.getConfig(this.next());
      }
    },
    /**
     * @param {(Error|null)} err
     * @param {(GetConfigResponse|null)} res
     */
    function verifyConfigStep(err, res)
    {
      if (err)
      {
        return this.skip({
          reason: 'VERIFICATION_FAILURE',
          data: {
            propertyName: 'program.config'
          },
          error: err
        });
      }

      try
      {
        verifyObject(ctx.program.config.config, res.config, 'program.config');
        verifyConfigDlsThresholds(this.majorVersion, ctx.program.config.config.dls, res.config.dls);
      }
      catch (data)
      {
        this.skip({
          reason: 'VERIFICATION_FAILURE',
          data: data instanceof Error ? {propertyName: 'program.config'} : data,
          error: data instanceof Error ? data : null
        });
      }
    },
    function getFactoryParametersStep()
    {
      if (ctx.program.factoryParameters)
      {
        util.log('Verifying factory parameters...');

        ctx.client.getFactoryParameters(this.next());
      }
    },
    /**
     * @param {(Error|null)} err
     * @param {(GetFactoryParametersResponse|null)} res
     */
    function verifyFactoryParametersStep(err, res)
    {
      if (err)
      {
        return this.skip({
          reason: 'VERIFICATION_FAILURE',
          data: {
            propertyName: 'program.factoryParameters'
          },
          error: err
        });
      }

      var required = ctx.program.factoryParameters;
      var actual = res;

      try
      {
        verifyFactoryParameter(required, actual, 'dlsEnabled');
        verifyFactoryParameter(required, actual, 'pirEnabled');
        verifyFactoryParameter(required, actual, 'lensType');
        verifyFactoryParameter(required, actual, 'daliMinLevel');
        verifyFactoryParameter(required, actual, 'startDelay');
        verifyFactoryParameter(required, actual, 'rtcCalibration');
        verifyFactoryParameter(required, actual, 'pirSensitivity');
        verifyFactoryParameter(required, actual, 'dlsCalibration');
      }
      catch (data)
      {
        this.skip({
          reason: 'VERIFICATION_FAILURE',
          data: data instanceof Error ? null : data,
          error: data instanceof Error ? data : null
        });
      }
    },
    function verifyScheduleStep()
    {
      if (!ctx.program.schedule)
      {
        return;
      }

      var steps = [];

      ctx.program.schedule.forEach(function(setSchedulerConfig)
      {
        var day = led4uc2.DailySchedule.Day.toString(setSchedulerConfig.day);

        steps.push(function getSchedulerConfigStep()
        {
          util.log('Verifying %s schedule...', day);

          ctx.client.getSchedulerConfig(setSchedulerConfig.day, this.next());
        });
        steps.push(function verifySchedulerConfigStep(err, res)
        {
          var propertyName = 'program.schedule.' + day;

          if (err)
          {
            return this.skip({
              reason: 'VERIFICATION_FAILURE',
              data: {
                propertyName: propertyName
              },
              error: err
            });
          }

          try
          {
            verifyObject(setSchedulerConfig.schedule, res.schedule, propertyName);
          }
          catch (data)
          {
            this.skip({
              reason: 'VERIFICATION_FAILURE',
              data: data instanceof Error ? {propertyName: propertyName} : data,
              error: data instanceof Error ? data : null
            });
          }
        });
      });

      steps.push(this.next());

      step(steps);
    },
    done
  );
};

function login(ctx, done)
{
  step(
    function getSecureLoginDataStep()
    {
      ctx.client.getSecureLoginData(this.next());
    },
    function handleGetSecureLoginDataStep(err, res)
    {
      if (err)
      {
        return this.skip({
          reason: 'LOGIN_FAILURE',
          error: err
        });
      }

      this.secretKey = res.key;
    },
    function factoryLoginStep()
    {
      ctx.client.factoryLogin(
        this.secretKey,
        ctx.config.factoryPassword,
        ctx.config.loginHashSeed,
        this.next()
      );
    },
    function handleFactoryLoginStep(err, res)
    {
      if (err)
      {
        return this.skip({
          reason: 'LOGIN_FAILURE',
          error: err
        });
      }

      if (res.errorCode)
      {
        return this.skip({
          reason: 'LOGIN_FAILURE',
          error: res.createOrderError()
        });
      }

      util.log('Logged in at factory level.');
    },
    done
  );
}

function verifyObject(expected, actual, prefix)
{
  var isArray = Array.isArray(expected);
  var keys = isArray ? null : Object.keys(expected);
  var l = isArray ? expected.length : keys.length;

  for (var i = 0; i < l; ++i)
  {
    var key = isArray ? i : keys[i];
    var propertyName = prefix + '.' + key;

    if (propertyName === 'program.config.dls.onThreshold'
      || propertyName === 'program.config.dls.offThreshold')
    {
      continue;
    }

    var expectedValue = expected[key];
    var actualValue = actual[key];

    if (actualValue === expectedValue)
    {
      continue;
    }

    if (expectedValue instanceof Date)
    {
      if (!(actualValue instanceof Date)
        || expectedValue.getTime() !== actualValue.getTime())
      {
        throw {
          propertyName: propertyName,
          expectedValue: expectedValue.toISOString(),
          actualValue: actualValue instanceof Date ? actualValue.toISOString() : actualValue
        };
      }

      continue;
    }

    if (typeof expectedValue === 'object' && expectedValue !== null)
    {
      verifyObject(expectedValue, actualValue, propertyName);

      continue;
    }

    throw {
      propertyName: propertyName,
      expectedValue: expectedValue,
      actualValue: actualValue
    };
  }
}

/**
 * @param {number} majorVersion
 * @param {Config.Dls} requiredDlsConfig
 * @param {Config.Dls} actualDlsConfig
 */
function verifyConfigDlsThresholds(majorVersion, requiredDlsConfig, actualDlsConfig)
{
  var requiredDlsThresholds = calculateDlsThresholds(
    majorVersion,
    requiredDlsConfig.onThreshold,
    requiredDlsConfig.offThreshold
  );
  var invalidPropertyName = null;

  if (actualDlsConfig.onThreshold !== requiredDlsThresholds.on)
  {
    invalidPropertyName = 'onThreshold';
  }
  else if (actualDlsConfig.offThreshold !== requiredDlsThresholds.off)
  {
    invalidPropertyName = 'offThreshold';
  }

  if (invalidPropertyName !== null)
  {
    throw {
      propertyName: 'program.config.dls.' + invalidPropertyName,
      majorVersion: majorVersion,
      inputThresholds: {
        on: requiredDlsConfig.onThreshold,
        off: requiredDlsConfig.offThreshold
      },
      requiredThresholds: requiredDlsThresholds,
      actualThresholds: {
        on: actualDlsConfig.onThreshold,
        off: actualDlsConfig.offThreshold
      }
    };
  }
}

/**
 * @param {number} majorVersion
 * @param {number} onThreshold
 * @param {number} offThreshold
 * @returns {{on: number, off: number}}
 */
function calculateDlsThresholds(majorVersion, onThreshold, offThreshold)
{
  if (offThreshold < 40)
  {
    offThreshold = 40;
  }

  if (majorVersion < 4)
  {
    if (offThreshold > 140)
    {
      offThreshold = 140;
    }
  }
  else if (offThreshold > 400)
  {
    offThreshold = 400;
  }

  if (majorVersion < 4)
  {
    onThreshold = 345;
  }
  else
  {
    if (onThreshold > 900)
    {
      onThreshold = 900;
    }
    else if (onThreshold < 440)
    {
      onThreshold = 440;
    }

    if ((onThreshold - offThreshold) > 500 || (onThreshold - offThreshold) < 200)
    {
      onThreshold = offThreshold + 400;
    }
  }

  return {
    on: onThreshold,
    off: offThreshold
  };
}

/**
 * @param {object} requiredParameters
 * @param {object} actualParameters
 * @param {string} parameterName
 */
function verifyFactoryParameter(requiredParameters, actualParameters, parameterName)
{
  var requiredValue = requiredParameters[parameterName];

  if (requiredValue === null)
  {
    return;
  }

  var actualValue = actualParameters[parameterName];

  if (actualValue !== requiredValue)
  {
    throw {
      propertyName: 'program.factoryParameters.' + parameterName,
      requiredValue: requiredValue,
      actualValue: actualValue
    };
  }
}
