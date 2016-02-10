// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var step = require('h5.step');
var glp2 = require('glp2');
var util = require('./util');

/**
 * @param {object} ctx
 * @param {function((Error|null)): void} done
 * @returns {function}
 */
module.exports = function testGlp2(ctx, done)
{
  /* eslint no-shadow:0 */

  util.log('[glp2] Testing...');

  ctx.glp2Progress = {};

  var cancelled = false;
  var changeState = function() {};
  var broker = {
    publish: function() {},
    subscribe: function()
    {
      return {cancel: function() {}};
    }
  };

  /** @type Glp2Manager */
  var manager = ctx.manager;
  var program = {
    name: 'M300P',
    steps: [ctx.test.glp2]
  };

  var startTestAttempts = 0;
  var alwaysAutostart = true;

  step(
    function executeProgramStepsStep()
    {
      var steps = [];

      program.steps.forEach(function(programStep, i)
      {
        if (programStep.enabled)
        {
          steps.push(createExecuteProgramStepStep(programStep, i));
        }
      });

      steps.push(this.next());

      step(steps);
    },
    function finalizeStep(err)
    {
      setImmediate(done, err);
    }
  );

  function updateStepProgress(stepIndex, stepProgress)
  {
    Object.keys(stepProgress).forEach(function(prop)
    {
      ctx.glp2Progress[prop] = stepProgress[prop];
    });
  }

  function createExecuteProgramStepStep(step, stepIndex)
  {
    if (step.type === 'wait')
    {
      return createExecuteWaitStepStep(step, stepIndex);
    }

    if (step.type === 'pe')
    {
      return createExecutePeStepStep(step, stepIndex);
    }

    if (step.type === 'iso')
    {
      return createExecuteIsoStepStep(step, stepIndex);
    }

    if (step.type === 'fn')
    {
      return createExecuteFnStepStep(step, stepIndex);
    }

    if (step.type === 'vis')
    {
      return createExecuteVisStepStep(step, stepIndex);
    }

    return function() {};
  }

  function createFinalizeProgramStepStep(stepIndex, done)
  {
    return function finalizeProgramStepStep(err)
    {
      if (this.successTimer)
      {
        clearTimeout(this.successTimer);
        this.successTimer = null;
      }

      if (this.cancelSub)
      {
        this.cancelSub.cancel();
        this.cancelSub = null;
      }

      if (cancelled)
      {
        err = 'CANCELLED';
      }

      if (err)
      {
        if (stepIndex >= 0)
        {
          updateStepProgress(stepIndex, {
            status: 'failure'
          });
        }

        return done(err);
      }

      if (stepIndex >= 0)
      {
        updateStepProgress(stepIndex, {
          status: 'success',
          progress: 100
        });
      }

      var finalizeResponse = this.finalizeResponse;

      if (finalizeResponse)
      {
        this.finalizeResponse = null;
      }

      setImmediate(done, null, finalizeResponse);
    };
  }

  function createExecuteWaitStepStep(programStep, stepIndex, waitingForContinue)
  {
    return function executeWaitStepStep(err)
    {
      if (cancelled || err)
      {
        return this.skip(err);
      }

      if (stepIndex >= 0)
      {
        util.log('[glp2] Executing %s', programStep);

        updateStepProgress(stepIndex, {
          status: 'active',
          progress: 0,
          value: -1
        });
      }

      var nextProgramStep = this.next();
      var finalizeResponse = null;

      step(
        createEmptyActualValuesStep(),
        function()
        {
          var nextStep = this.next();
          var successTimer = null;
          var progressTimer = null;
          var waitingSub;
          var cancelSub;

          if (programStep.kind === 'auto')
          {
            var totalTime = programStep.duration * 1000;
            var startTime = Date.now();

            this.successTimer = successTimer = setTimeout(nextStep, totalTime);
            this.progressTimer = progressTimer = setInterval(function()
            {
              updateStepProgress(stepIndex, {
                progress: (Date.now() - startTime) * 100 / totalTime
              });
            }, 250);
          }
          else
          {
            if (stepIndex >= 0)
            {
              updateStepProgress(stepIndex, {
                progress: 50
              });
            }

            changeState({waitingForContinue: waitingForContinue || 'test'});

            this.waitingSub = waitingSub = broker.subscribe('programmer.stateChanged', function(changes)
            {
              if (changes.waitingForContinue === null)
              {
                waitingSub.cancel();
                waitingSub = null;

                cancelSub.cancel();
                cancelSub = null;

                setImmediate(nextStep);
              }
            });

            this.cancelMonitor = getActualValues(function(err, res)
            {
              if (err)
              {
                return nextStep(err);
              }

              finalizeResponse = res;

              changeState({waitingForContinue: null});
            });
          }

          cancelSub = this.cancelSub = broker.subscribe('programmer.cancelled', function()
          {
            if (successTimer !== null)
            {
              clearTimeout(successTimer);
              clearInterval(progressTimer);
            }

            nextStep();
          });
        },
        function(err)
        {
          if (this.cancelMonitor)
          {
            this.cancelMonitor();
            this.cancelMonitor = null;
          }

          if (this.progressTimer)
          {
            clearTimeout(this.progressTimer);
            this.progressTimer = null;
          }

          if (this.waitingSub)
          {
            this.waitingSub.cancel();
            this.waitingSub = null;
          }

          if (err)
          {
            return this.skip(err);
          }

          this.finalizeResponse = finalizeResponse;
        },
        createFinalizeProgramStepStep(stepIndex, nextProgramStep)
      );
    };
  }

  function createExecutePeStepStep(programStep, stepIndex)
  {
    return function executePeStepStep(err)
    {
      if (cancelled || err)
      {
        return this.skip(err);
      }

      util.log('[glp2] Executing %s', programStep);

      updateStepProgress(stepIndex, {
        status: 'active',
        progress: 0
      });

      executeTestStep(glp2.PeTest.fromObject(programStep), stepIndex, this.next());
    };
  }

  function createExecuteIsoStepStep(programStep, stepIndex)
  {
    return function executeIsoStepStep(err)
    {
      if (cancelled || err)
      {
        return this.skip(err);
      }

      util.log('[glp2] Executing %s', programStep);

      updateStepProgress(stepIndex, {
        status: 'active',
        progress: 0
      });

      executeTestStep(glp2.IsoTest.fromObject(programStep), stepIndex, this.next());
    };
  }

  function createExecuteFnStepStep(programStep, stepIndex)
  {
    return function executeFnStepStep(err)
    {
      if (cancelled || err)
      {
        return this.skip(err);
      }

      util.log('[glp2] Executing %s', programStep);

      updateStepProgress(stepIndex, {
        status: 'active',
        progress: 0
      });

      executeTestStep(glp2.FctTest.fromObject(programStep), stepIndex, this.next());
    };
  }

  function createExecuteVisStepStep(programStep, stepIndex)
  {
    return function executeVisStepStep(err)
    {
      if (cancelled || err)
      {
        return this.skip(err);
      }

      util.log('[glp2] Executing %s', programStep);

      updateStepProgress(stepIndex, {
        status: 'active',
        progress: 0,
        value: -1
      });

      step(
        createEmptyActualValuesStep(),
        createSetTestProgramStep(glp2.VisTest.fromObject(programStep)),
        createStartTestStep(true),
        function executeVisStep()
        {
          var nextStep = this.next();
          var ackTimer = null;
          var progressTimer = null;
          var waitingSub = null;
          var ackStartTime = programStep.duration * 1000;
          var totalTime = 0;
          var startTime = Date.now();

          if (programStep.maxDuration)
          {
            totalTime = programStep.maxDuration * 1000;
          }
          else if (programStep.duration)
          {
            totalTime = programStep.duration * 2 * 1000;
          }

          this.ackTimer = ackTimer = setTimeout(function()
          {
            changeState({
              waitingForContinue: 'vis'
            });
          }, ackStartTime);

          this.progressTimer = progressTimer = setInterval(function()
          {
            updateStepProgress(stepIndex, {
              progress: (Date.now() - startTime) * 100 / totalTime
            });
          }, 250);

          this.waitingSub = waitingSub = broker.subscribe('programmer.stateChanged', function(changes)
          {
            if (changes.waitingForContinue !== null)
            {
              return;
            }

            clearTimeout(ackTimer);
            clearInterval(progressTimer);
            waitingSub.cancel();

            manager.ackVisTest(true, function(err)
            {
              if (err)
              {
                nextStep(err);
              }
            });
          });

          this.cancelMonitor = getActualValues(function(err, res)
          {
            if (cancelled || err)
            {
              return nextStep(err);
            }

            clearTimeout(ackTimer);
            clearInterval(progressTimer);
            waitingSub.cancel();

            changeState({waitingForContinue: null});

            handleActualValuesResponse(programStep, stepIndex, res, nextStep);
          });

          this.cancelSub = broker.subscribe('programmer.cancelled', nextStep);
        },
        function cleanUpVisStep(err)
        {
          if (this.cancelMonitor)
          {
            this.cancelMonitor();
            this.cancelMonitor = null;
          }

          if (this.ackTimer)
          {
            clearTimeout(this.ackTimer);
            this.ackTimer = null;
          }

          if (this.progressTimer)
          {
            clearInterval(this.progressTimer);
            this.progressTimer = null;
          }

          if (this.waitingSub)
          {
            this.waitingSub.cancel();
            this.waitingSub = null;
          }

          if (err)
          {
            return this.skip(err);
          }
        },
        createFinalizeProgramStepStep(stepIndex, this.next())
      );
    };
  }

  function executeTestStep(programStep, stepIndex, done)
  {
    step(
      createEmptyActualValuesStep(),
      createSetTestProgramStep(programStep),
      createStartTestStep(),
      createMonitorActualValuesStep(programStep, stepIndex),
      createFinalizeProgramStepStep(stepIndex, done)
    );
  }

  function createSetTestProgramStep(programStep)
  {
    return function setTestProgramStep(err)
    {
      if (cancelled || err)
      {
        return this.skip(err);
      }

      manager.setTestProgram(program.name, programStep, this.next());
    };
  }

  function createStartTestStep(autostart)
  {
    return function startTestStep(err)
    {
      ++startTestAttempts;

      if (cancelled || err)
      {
        return this.skip(err);
      }

      if (alwaysAutostart || autostart || startTestAttempts > 1)
      {
        return manager.startTest(this.next());
      }

      step(
        createExecuteWaitStepStep({kind: 'manual'}, -1, 'glp2'),
        this.next()
      );
    };
  }

  function createEmptyActualValuesStep()
  {
    return function emptyActualValuesStep(err)
    {
      if (cancelled || err)
      {
        return this.skip(err);
      }

      emptyActualValues(this.next());
    };
  }

  function createMonitorActualValuesStep(programStep, stepIndex)
  {
    return function monitorActualValuesStep(err, res)
    {
      if (cancelled || err)
      {
        return this.skip(err);
      }

      if (res)
      {
        handleGetActualValuesResponse(programStep, stepIndex, res, this.next());
      }
      else
      {
        monitorActualValues(programStep, stepIndex, this.next());
      }
    };
  }

  function emptyActualValues(done)
  {
    manager.getActualValues(function(err, res)
    {
      if (cancelled || err)
      {
        return done(err);
      }

      if (res)
      {
        return setImmediate(emptyActualValues, done);
      }

      return setImmediate(done);
    });
  }

  function monitorActualValues(programStep, stepIndex, done)
  {
    getActualValues(function(err, res)
    {
      if (err)
      {
        return done(err);
      }

      return handleGetActualValuesResponse(programStep, stepIndex, res, done);
    });
  }

  function getActualValues(done)
  {
    var cancelled = false;

    manager.getActualValues(function(err, res)
    {
      if (cancelled)
      {
        return;
      }

      if (cancelled || err)
      {
        done(err);

        return;
      }

      if (!res)
      {
        setImmediate(getActualValues, done);

        return;
      }

      setImmediate(done, null, res);
    });

    return function() { cancelled = true; };
  }

  function handleGetActualValuesResponse(programStep, stepIndex, res, done)
  {
    if (cancelled)
    {
      return done();
    }

    if (res.type === glp2.ResponseType.INTERIM_ACTUAL_VALUES)
    {
      return handleInterimActualValuesResponse(programStep, stepIndex, res, done);
    }

    if (res.type === glp2.ResponseType.ACTUAL_VALUES)
    {
      return handleActualValuesResponse(programStep, stepIndex, res, done);
    }

    return done('GLP2:UNEXPECTED_RESPONSE');
  }

  function handleInterimActualValuesResponse(programSteps, stepIndexes, res, done)
  {
    var programStep;
    var stepIndex;

    if (typeof stepIndexes !== 'number')
    {
      programStep = programSteps[res.stepNumber - 1];
      stepIndex = stepIndexes[res.stepNumber - 1];
    }
    else
    {
      programStep = programSteps;
      stepIndex = stepIndexes;
    }

    updateStepProgress(stepIndex, {
      value: res.value1,
      unit: res.unit1,
      progress: Math.round((res.time / programStep.getTotalTime()) * 100)
    });

    setImmediate(monitorActualValues, programSteps, stepIndexes, done);
  }

  function handleActualValuesResponse(programSteps, stepIndexes, res, done)
  {
    var stepNumber = res.steps.length ? (res.steps[0].stepNumber - 1) : -1;
    var stepIndex = typeof stepIndexes !== 'number' ? stepIndexes[stepNumber] : stepIndexes;

    if (cancelled)
    {
      updateStepProgress(stepIndex, {
        status: 'failure'
      });

      return setImmediate(done, 'GLP2:FAULT:' + glp2.FaultStatus.CANCELLED);
    }

    if (res.faultStatus)
    {
      updateStepProgress(stepIndex, {
        status: 'failure'
      });

      return setImmediate(done, 'GLP2:FAULT:' + res.faultStatus);
    }

    var testResult = res.steps[0];

    if (!testResult)
    {
      // No test results and completed? Operator cancelled the test using the tester's panel.
      if (res.completed)
      {
        updateStepProgress(stepIndex, {
          status: 'failure'
        });

        return setImmediate(done, 'GLP2:FAULT:' + glp2.FaultStatus.CANCELLED);
      }

      return setImmediate(done);
    }

    if (testResult.evaluation)
    {
      updateStepProgress(stepIndex, {
        status: 'success',
        progress: 100
      });

      return setImmediate(done);
    }

    updateStepProgress(stepIndex, {
      status: 'failure'
    });

    if (typeof testResult.setValue === 'undefined')
    {
      return setImmediate(done, 'GLP2:TEST_STEP_FAILURE');
    }

    var testStepFailureErr = new Error(
      'Expected set value 1: `' + testResult.setValue + '`,'
        + ' got actual value 1: `' + testResult.actualValue + '`.'
        + ' Expected set value 2: `' + testResult.setValue2 + '`,'
        + ' got actual value 2: `' + testResult.actualValue2 + '`.'
    );

    testStepFailureErr.code = 'GLP2:TEST_STEP_FAILURE';

    util.log('[glp2] Test step failure: 5s', testStepFailureErr.message);

    return setImmediate(done, testStepFailureErr);
  }

  return function cancel()
  {
    cancelled = true;
  };
};
