'use strict';

var spawn = require('child_process').spawn;
var fs = require('fs');

var exe = __dirname + '/../bin/node.exe';
var args = [
  __dirname + '/../lib/index.js',
  '--input', '-'
];
var p = spawn(exe, args);

p.on('error', function(err)
{
  console.log('[error] %s', err.message);
});

p.on('close', function(code)
{
  if (code)
  {
    console.log('[close] %d', code);
  }
});

p.stderr.setEncoding('utf8');
p.stderr.on('data', function(data)
{
  process.stderr.write(data);
});

p.stdout.setEncoding('utf8');
p.stdout.on('data', function(data)
{
  process.stdout.write(data);
});

p.stdin.write(fs.readFileSync(__dirname + '/input.json'));
