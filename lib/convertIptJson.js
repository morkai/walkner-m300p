// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

module.exports = function convertIptJson(iptJson)
{
  var result = {
    config: iptJson.config
  };

  if (typeof iptJson.program !== 'undefined')
  {
    result.program = convertIptProgram(iptJson.program);
  }

  if (typeof iptJson.test !== 'undefined')
  {
    result.test = iptJson.test;
  }

  return result;
};

function convertIptProgram(iptProgram)
{
  var program = {};

  if (typeof iptProgram.nameAndNumber !== 'undefined')
  {
    program.nameAndNumber = iptProgram.nameAndNumber;
  }

  if (typeof iptProgram.textInfoSet !== 'undefined')
  {
    program.textInfo = iptProgram.textInfoSet;
  }

  if (typeof iptProgram.serialNumber !== 'undefined')
  {
    program.serialNumber = iptProgram.serialNumber;
  }

  if (typeof iptProgram.config !== 'undefined')
  {
    program.config = convertIptConfig(iptProgram.config);
  }

  var factoryParameters = iptProgram.factoryParameters;

  if (typeof factoryParameters !== 'undefined')
  {
    program.factoryParameters = {
      dlsEnabled: factoryParameters.factoryDlsOn,
      pirEnabled: factoryParameters.factoryPirOn,
      lensType: factoryParameters.factoryLensType,
      daliMinLevel: factoryParameters.factoryDaliMin,
      startDelay: factoryParameters.factoryStartDelay,
      rtcCalibration: factoryParameters.factoryRtc,
      pirSensitivity: factoryParameters.factoryPirSensitive,
      dlsCalibration: factoryParameters.factoryDlsCal
    };
  }

  if (typeof iptProgram.scheduler !== 'undefined')
  {
    program.schedule = convertIptSchedule(iptProgram.scheduler);
  }

  return program;
}

function convertIptConfig(config)
{
  if (!config.pir)
  {
    config.pir = {};
  }

  if (!config.dls)
  {
    config.dls = {};
  }

  if (!config.selectingBlinking)
  {
    config.selectingBlinking = {};
  }

  if (!config.warningBlinking)
  {
    config.warningBlinking = {};
  }

  return {
    pir: {
      onLevel: config.pir.pirAct,
      dimLevel: config.pir.pirNact,
      fadeIn: config.pir.pirLightupTime,
      fadeOut: config.pir.pirLightdownTime,
      delay: config.pir.pirHoldTime,
      flag: config.pir.pirConfigField,
      sensitivity: config.pir.pirSensitive
    },
    maxLampPower: config.maxLight,
    dls: {
      onLevel: config.dls.dlsAct,
      dimLevel: config.dls.dlsNact,
      fadeIn: config.dls.dlsLightupTime,
      fadeOut: config.dls.dlsLightdownTime,
      delay: config.dls.dlsHoldTime,
      flag: config.dls.pirConfigField,
      onThreshold: config.dls.dlsOn,
      offThreshold: config.dls.dlsOff
    },
    selectingBlinking: {
      timeOn: config.selectingBlinking.blinkingOn,
      timeOff: config.selectingBlinking.blinkingOff,
      pulses: config.selectingBlinking.blinking
    },
    warningBlinking: {
      timeOn: config.warningBlinking.emergencyBlinkingOn,
      timeOff: config.warningBlinking.emergencyBlinkingOff,
      pulses: config.warningBlinking.emergencyBlinking
    },
    fixedLevel: config.lightLevel,
    workMode: config.workMode,
    dlsSetValue: config.dlsSetValue
  };
}

function convertIptSchedule(iptSchedule)
{
  var schedule = {};

  Object.keys(iptSchedule).forEach(function(day)
  {
    schedule[day] = convertIptDailySchedule(iptSchedule[day]);
  });

  return schedule;
}

function convertIptDailySchedule(iptSchedule)
{
  var schedule = new Array(8);

  for (var i = 0; i < 8; ++i)
  {
    schedule[i] = {
      hours: -1,
      minutes: -1,
      func: -1,
      level: -1
    };
  }

  iptSchedule.forEach(function(iptDailySchedule)
  {
    var scheduleI = -1;
    var keys = Object.keys(iptDailySchedule);

    for (var keyI = 0; keyI < keys.length; ++keyI)
    {
      var matches = keys[keyI].match(/^hour([0-9]+)/);

      if (matches)
      {
        scheduleI = +matches[1];

        break;
      }
    }

    if (scheduleI !== -1)
    {
      schedule[scheduleI] = {
        hours: iptDailySchedule['hour' + scheduleI],
        minutes: iptDailySchedule['minute' + scheduleI],
        func: iptDailySchedule['function' + scheduleI],
        level: iptDailySchedule['level' + scheduleI]
      };
    }
  });

  return schedule;
}
