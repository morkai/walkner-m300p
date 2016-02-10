// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var lastTotalProgress = 0;

exports.operations = {
  setup: {
    enabled: true,
    progress: 0,
    done: [],
    todo: ['glp2:start', 'bt:conf', 'bt:delay', 'bt:connect']
  },
  program: {
    enabled: false,
    progress: 0,
    done: [],
    todo: ['setup', 'set:factoryParameters', 'set:schedule', 'verify:factoryParameters', 'verify:schedule']
  },
  test: {
    enabled: false,
    progress: 0,
    done: [],
    todo: []
  },
  read: {
    enabled: false,
    progress: 0,
    done: [],
    todo: ['config', 'factoryParameters', 'schedule']
  },
  cleanup: {
    enabled: true,
    progress: 0,
    done: [],
    todo: ['stopPreview', 'bt:close', 'bt:kill', 'bt:unpair', 'glp2:reset', 'glp2:stop']
  }
};

exports.reset = function()
{
  Object.keys(exports.operations).forEach(function(k)
  {
    var operation = exports.operations[k];

    operation.enabled = false;
    operation.progress = 0;
    operation.done = [];
  });

  exports.operations.setup.enabled = true;
  exports.operations.cleanup.enabled = true;
};

exports.update = function(operation, progress)
{
  exports.operations[operation].progress = progress;
};

exports.complete = function(operation, step)
{
  operation = exports.operations[operation];

  operation.done.push(step);

  operation.progress = operation.done.length / operation.todo.length * 100;

  exports.log();
};

exports.log = function()
{
  var progressInOperations = [];

  Object.keys(exports.operations).forEach(function(k)
  {
    var operation = exports.operations[k];

    if (operation.enabled)
    {
      progressInOperations.push(operation.progress);
    }
  });

  var progressPerOperation = 100 / progressInOperations.length;
  var totalProgress = 0;

  progressInOperations.forEach(function(operationProgress)
  {
    totalProgress += progressPerOperation * (operationProgress / 100);
  });

  totalProgress = Math.round(totalProgress);

  if (totalProgress !== lastTotalProgress)
  {
    lastTotalProgress = totalProgress;

    console.error('% %d', totalProgress);
  }
};
