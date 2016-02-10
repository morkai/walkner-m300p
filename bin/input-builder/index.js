/* eslint-env browser,jquery */

'use strict';

var $builder = $('#builder');
var $result = $('#result');
var $propertyHints = $('code[data-ipt]');
var resizeTimer = null;
var init = true;
var resultType = 'ipt';
var resultObjects = {
  m300p: {},
  ipt: {}
};
var resultStrings = {
  m300p: '{}',
  ipt: '{}'
};

$propertyHints.each(function()
{
  this.dataset.m300p = this.textContent;
});

(function()
{
  var $schedule = $('#schedule');
  var $insertPoint = $schedule.prev();
  var template = $schedule.detach().removeAttr('id')[0].outerHTML;
  var days = {
    SUN: 'Niedziela',
    MON: 'Poniedziałek',
    TUE: 'Wtorek',
    WED: 'Środa',
    THU: 'Czwartek',
    FRI: 'Piątek',
    SAT: 'Sobota',
    DAY: 'Tryb dzienny'
  };
  var html = '';

  Object.keys(days).forEach(function(dayValue)
  {
    html += template
      .replace(/\{DAY_NAME\}/g, days[dayValue])
      .replace(/\{DAY_VALUE\}/g, dayValue);
  });

  $(html).insertAfter($insertPoint);
})();

$(function()
{
  $(window).on('resize', function()
  {
    $result.css('height', ($result.parent().outerHeight() - $result.prev().outerHeight()) + 'px');
  }).trigger('resize');

  $('.result-type').on('click', function()
  {
    $('.result-type.active').removeClass('active');
    $(this).addClass('active');

    resultType = this.value;

    $result.val(resultStrings[resultType]);

    updatePropertyHints();
  });

  $('.form-group-toggle').on('change', function()
  {
    var id = this.id;
    var $toggleableFormGroup = $('.toggleable-form-group[data-group="' + id + '"]');

    $toggleableFormGroup
      .toggleClass('is-disabled', !this.checked)
      .find('input, textarea, select')
      .prop('disabled', !this.checked);

    if (this.checked)
    {
      $toggleableFormGroup.find('.form-group-toggle').trigger('change');
    }

    if (resizeTimer !== null)
    {
      clearTimeout(resizeTimer);
    }

    resizeTimer = setTimeout(resizeResult, 0);
  });

  $('#test-glp2-mode').on('change', function()
  {
    var $group = $('.group[data-group="test-glp2"]');
    var $setValue = $('#test-glp2-setValue');
    var $label = $('#test-glp2-setValue-label');
    var dataset = this.selectedOptions[0].dataset;

    $label.text(dataset.label);
    $setValue.attr({
      min: dataset.min || '',
      max: dataset.max || '',
      step: dataset.step || ''
    });
    $setValue.val(dataset.min || '0');
    $setValue.prop('disabled', !dataset.step);
    $group.find('[name*="Tolerance"]').prop('disabled', !dataset.step);
    $group.find('.test-glp2-unit').text((dataset.label.match(/\[(.*?)\]/) || [''])[0]);
    $group.find('[name*="ToleranceAbs"]').attr('step', dataset.step || '');

    buildResult();
  });

  $builder.on('focusin', function(e)
  {
    var $group = $(e.target);

    do
    {
      $group = $group.parent().closest('.group').addClass('is-active');
    }
    while ($group.length);
  });

  $builder.on('focusout', function()
  {
    $('.group.is-active').removeClass('is-active');
  });

  $builder.on('change', function()
  {
    buildResult();

    $result[0].setCustomValidity($builder[0].checkValidity() ? '' : ':-(');
  });

  $builder.on('submit', function()
  {
    buildResult();

    return false;
  });

  $($('.group[data-group="program"]').find('.form-group-toggle').get().reverse()).click();
  $('#program').click();
  $('#test').click();

  init = false;

  updatePropertyHints();
  buildResult();
  resizeResult();
});

function updatePropertyHints()
{
  $propertyHints.each(function()
  {
    this.textContent = this.dataset[resultType];
  });
}

function buildResult()
{
  if (init)
  {
    return;
  }

  resultObjects.m300p = $builder.serializeObject();

  if (resultObjects.m300p.config.deviceMac === '')
  {
    delete resultObjects.m300p.config.deviceMac;
  }

  if (resultObjects.m300p.test)
  {
    if (resultObjects.m300p.test.glp2)
    {
      prepareGlp2Test(resultObjects.m300p.test.glp2);
    }
  }

  var logging = resultObjects.m300p.config.logging || {};

  resultObjects.m300p.config.logging = {
    error: !!logging.error,
    conn: !!logging.conn,
    txrx: !!logging.txrx,
    reqres: !!logging.reqres
  };

  resultObjects.ipt = convertToIpt(resultObjects.m300p);

  resultStrings.m300p = JSON.stringify(resultObjects.m300p, null, 2);
  resultStrings.ipt = JSON.stringify(resultObjects.ipt, null, 2);

  $result.prop('value', resultStrings[resultType]);
}

function prepareGlp2Test(glp2)
{
  ['label', 'startTime', 'duration', 'setValue'].forEach(function(prop)
  {
    if (!glp2[prop])
    {
      delete glp2[prop];
    }
  });

  if (!glp2.label)
  {
    delete glp2.label;
  }

  glp2.mode = +glp2.mode;

  if (!glp2.setValue)
  {
    delete glp2.lowerToleranceAbs;
    delete glp2.upperToleranceAbs;
    delete glp2.lowerToleranceRel;
    delete glp2.upperToleranceRel;
  }
}

function resizeResult()
{
  if (resizeTimer !== null)
  {
    clearTimeout(resizeTimer);
    resizeTimer = null;
  }

  if (init)
  {
    return;
  }

  $result.attr('rows', $result[0].value.split('\n').length);
}

function convertToIpt(m300pResult)
{
  var iptResult = {
    config: $.extend(true, {}, m300pResult.config)
  };

  var m300pProgram = m300pResult.program;

  if (m300pProgram)
  {
    var iptProgram = iptResult.program = {};

    if (typeof m300pProgram.nameAndNumber !== 'undefined')
    {
      iptProgram.nameAndNumber = $.extend(true, {}, m300pProgram.nameAndNumber);
    }

    if (typeof m300pProgram.textInfo !== 'undefined')
    {
      iptProgram.textInfoSet = m300pProgram.textInfo;
    }

    if (typeof m300pProgram.serialNumber !== 'undefined')
    {
      iptProgram.serialNumber = m300pProgram.serialNumber;
    }

    var config = m300pProgram.config;

    if (typeof config !== 'undefined')
    {
      iptProgram.config = {
        pir: {
          pirAct: config.pir.onLevel,
          pirNact: config.pir.dimLevel,
          pirLightupTime: config.pir.fadeIn,
          pirLightdownTime: config.pir.fadeOut,
          pirHoldTime: config.pir.delay,
          pirConfigField: config.pir.flag,
          pirSensitive: config.pir.sensitivity
        },
        maxLight: config.maxLampPower,
        dls: {
          dlsAct: config.dls.onLevel,
          dlsNact: config.dls.dimLevel,
          dlsLightupTime: config.dls.fadeIn,
          dlsLightdownTime: config.dls.fadeOut,
          dlsHoldTime: config.dls.delay,
          pirConfigField: config.dls.flag,
          dlsOn: config.dls.onThreshold,
          dlsOff: config.dls.offThreshold
        },
        selectingBlinking: {
          blinkingOn: config.selectingBlinking.timeOn,
          blinkingOff: config.selectingBlinking.timeOff,
          blinking: config.selectingBlinking.pulses
        },
        warningBlinking: {
          emergencyBlinkingOn: config.warningBlinking.timeOn,
          emergencyBlinkingOff: config.warningBlinking.timeOff,
          emergencyBlinking: config.warningBlinking.pulses
        },
        lightLevel: config.fixedLevel,
        workMode: config.workMode,
        dlsSetValue: config.dlsSetValue
      };
    }

    var factoryParameters = m300pProgram.factoryParameters;

    if (typeof factoryParameters !== 'undefined')
    {
      iptProgram.factoryParameters = {
        factoryDlsOn: factoryParameters.dlsEnabled,
        factoryPirOn: factoryParameters.pirEnabled,
        factoryLensType: factoryParameters.lensType,
        factoryDaliMin: factoryParameters.daliMinLevel,
        factoryStartDelay: factoryParameters.startDelay,
        factoryRtc: factoryParameters.rtcCalibration,
        factoryPirSensitive: factoryParameters.pirSensitivity,
        factoryDlsCal: factoryParameters.dlsCalibration
      };
    }

    var schedule = m300pProgram.schedule;

    if (typeof schedule !== 'undefined')
    {
      iptProgram.schedule = {};

      Object.keys(schedule).forEach(function(day)
      {
        iptProgram.schedule[day] = schedule[day].map(function(dailySchedule, i)
        {
          var iptDailySchedule = {};

          iptDailySchedule['hour' + i] = dailySchedule.hours;
          iptDailySchedule['minute' + i] = dailySchedule.minutes;
          iptDailySchedule['function' + i] = dailySchedule.func;
          iptDailySchedule['level' + i] = dailySchedule.level;

          return iptDailySchedule;
        });
      });
    }
  }

  if (typeof m300pResult.test !== 'undefined')
  {
    iptResult.test = $.extend(true, {}, m300pResult.test);
  }

  return iptResult;
}
