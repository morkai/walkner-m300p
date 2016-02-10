// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var step = require('h5.step');
var led4uc2 = require('./led4uc2');
var util = require('./util');

/**
 * @param {object} ctx
 * @param {function((Error|null)): void} done
 * @returns {function}
 */
module.exports = function testM300(ctx, done)
{
  util.log('[m300] Testing...');

  var lightLevel = -1;

  ctx.result.test = [];

  step(
    function startPreviewStep()
    {
      ctx.client.send(ctx.test.m300, this.next());
    },
    function handleStartPreviewStep(err)
    {
      if (err)
      {
        return this.skip({
          reason: 'TESTING_FAILURE',
          error: err
        });
      }
    },
    function monitorPreviewProgressStep()
    {
      /* eslint-disable no-shadow */

      var nextStep = util.once(this.next());
      var lastPreviewStep = led4uc2.PreviewStep.DISABLED;

      getStatus();

      function getStatus()
      {
        ctx.client.getStatus(function(err, res)
        {
          if (err)
          {
            return nextStep({
              reason: 'TESTING_FAILURE',
              error: err
            });
          }

          lightLevel = res.status.lightLevel;

          setTimeout(getProgress, 200);
        });
      }

      function getProgress()
      {
        ctx.client.getProgress(function(err, res)
        {
          if (err)
          {
            return nextStep({
              reason: 'TESTING_FAILURE',
              error: err
            });
          }

          if (res.errorCode)
          {
            return nextStep({
              reason: 'TESTING_FAILURE',
              error: res.createOrderError()
            });
          }

          var previewStep = led4uc2.PreviewStep.toString(lastPreviewStep);

          ctx.result.test.push({
            time: Date.now(),
            progress: res.progress,
            previewStep: previewStep,
            lightLevel: lightLevel,
            setValue: ctx.test.glp2.setValue,
            actualValue: ctx.glp2Progress.value,
            unit: ctx.glp2Progress.unit
          });

          util.log('[m300#progress] %s', ctx.result.test[ctx.result.test.length - 1]);

          if (res.value !== lastPreviewStep)
          {
            lastPreviewStep = res.value;

            util.log(
              '[m300] Test entered the %s step (%d%)',
              previewStep,
              res.progress
            );
          }

          if (lastPreviewStep === led4uc2.PreviewStep.LEAD_OUT && res.progress === 100)
          {
            return setImmediate(nextStep);
          }

          setImmediate(getStatus);
        });
      }
    },
    done
  );
};
