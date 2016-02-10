// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var util = require('util');

exports.once = function(fn)
{
  var called = false;
  var result;

  return function once()
  {
    if (called)
    {
      return result;
    }

    called = true;
    result = fn.apply(this, arguments);

    return result;
  };
};

exports.buf2hex = function(buffer)
{
  var hex = [];

  for (var i = 0, l = buffer.length; i < l; ++i)
  {
    if (buffer[i] < 0x10)
    {
      hex.push('0' + buffer[i].toString(16));
    }
    else
    {
      hex.push(buffer[i].toString(16));
    }
  }

  return hex.join(' ');
};

exports.log = function()
{
  var args = Array.prototype.slice.call(arguments);

  if (typeof args[0] === 'string')
  {
    for (var i = 1, l = args.length; i < l; ++i)
    {
      var arg = args[i];

      if (arg !== null && typeof arg === 'object')
      {
        args[i] = util.inspect(arg, {depth: 5, colors: false});
      }
    }

    console.error('>>>> ' + getDateString() + ' ' + util.format.apply(util, args).trim());
  }
  else
  {
    console.error.apply(console, args);
  }
};

function getDateString()
{
  var now = new Date();
  var str = now.getFullYear().toString().substr(2)
    + '-' + pad0(now.getMonth() + 1)
    + '-' + pad0(now.getDate())
    + ' ' + pad0(now.getHours())
    + ':' + pad0(now.getMinutes())
    + ':' + pad0(now.getSeconds())
    + '.';

  var ms = now.getMilliseconds();

  if (ms < 10)
  {
    str += '00';
  }
  else if (ms < 100)
  {
    str += '0';
  }

  str += ms;
  str += '+' + pad0(now.getTimezoneOffset() / 60 * -1);

  return str;
}

function pad0(str)
{
  return (str.toString().length === 1 ? '0' : '') + str;
}
