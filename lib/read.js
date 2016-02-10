// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var step = require('h5.step');
var led4uc2 = require('./led4uc2');
var util = require('./util');

module.exports = function test(ctx, done)
{
  util.log('Reading...');

  step(
    function getNameAndNumberStep()
    {
      util.log('Reading name and number...');

      ctx.client.getNameAndNumber(this.next());
    },
    /**
     * @param {(Error|null)} err
     * @param {(GetNameAndNumberResponse|null)} res
     */
    function saveNameAndNumberStep(err, res)
    {
      if (err)
      {
        return this.skip({
          reason: 'READING_FAILURE',
          data: {
            propertyName: 'nameAndNumber'
          },
          error: err
        });
      }

      ctx.result.nameAndNumber = {
        name: res.name,
        number: res.number
      };
    },
    function getTextInfoStep()
    {
      util.log('Reading text info...');

      ctx.client.getTextInfo(this.next());
    },
    /**
     * @param {(Error|null)} err
     * @param {(TextResponse|null)} res
     */
    function saveTextInfoStep(err, res)
    {
      if (err)
      {
        return this.skip({
          reason: 'READING_FAILURE',
          data: {
            propertyName: 'textInfo'
          },
          error: err
        });
      }

      ctx.result.textInfo = res.text;
    },
    function getSerialNumberStep()
    {
      util.log('Reading serial number...');

      ctx.client.getSerialNumber(this.next());
    },
    /**
     * @param {(Error|null)} err
     * @param {(TextResponse|null)} res
     */
    function saveSerialNumberStep(err, res)
    {
      if (err)
      {
        return this.skip({
          reason: 'READING_FAILURE',
          data: {
            propertyName: 'serialNumber'
          },
          error: err
        });
      }

      ctx.result.serialNumber = res.text;
    },
    function getConfigStep()
    {
      util.log('Reading configuration...');

      ctx.client.getConfig(this.next());
    },
    /**
     * @param {(Error|null)} err
     * @param {(GetConfigResponse|null)} res
     */
    function saveConfigStep(err, res)
    {
      if (err)
      {
        return this.skip({
          reason: 'READING_FAILURE',
          data: {
            propertyName: 'config'
          },
          error: err
        });
      }

      ctx.result.config = res.config.inspect();

      ctx.progress.complete('read', 'config');
    },
    function getFactoryParametersStep()
    {
      util.log('Reading factory parameters...');

      ctx.client.getFactoryParameters(this.next());
    },
    /**
     * @param {(Error|null)} err
     * @param {(GetFactoryParametersResponse|null)} res
     */
    function saveFactoryParametersStep(err, res)
    {
      if (err)
      {
        return this.skip({
          reason: 'READING_FAILURE',
          data: {
            propertyName: 'factoryParameters'
          },
          error: err
        });
      }

      ctx.result.factoryParameters = {
        dlsEnabled: res.dlsEnabled,
        pirEnabled: res.pirEnabled,
        lensType: res.lensType,
        daliMinLevel: res.daliMinLevel,
        startDelay: res.startDelay,
        rtcCalibration: res.rtcCalibration,
        pirSensitivity: res.pirSensitivity,
        dlsCalibration: res.dlsCalibration
      };

      ctx.progress.complete('read', 'factoryParameters');
    },
    function getAndSaveScheduleStep()
    {
      var steps = [];

      ctx.result.schedule = {};

      Object.keys(led4uc2.DailySchedule.Day).forEach(function(day)
      {
        steps.push(function getSchedulerConfigStep()
        {
          util.log('Reading %s schedule...', day);

          ctx.client.getSchedulerConfig(led4uc2.DailySchedule.Day[day], this.next());
        });
        steps.push(function saveSchedulerConfigStep(err, res)
        {
          var propertyName = 'schedule.' + day;

          if (err)
          {
            return this.skip({
              reason: 'READING_FAILURE',
              data: {
                propertyName: propertyName
              },
              error: err
            });
          }

          ctx.result.schedule[day] = res.schedule;
        });
      });

      steps.push(this.next());

      step(steps);
    },
    function(err)
    {
      if (err)
      {
        return this.skip(err);
      }

      ctx.progress.complete('read', 'schedule');
    },
    done
  );
};
