'use strict';

var http = require('http');
var fs = require('fs');

var postData = fs.readFileSync(__dirname + '/input.json');

var options = {
  hostname: 'localhost',
  port: 1337,
  path: '/?deviceMac=' + (process.argv[2] || '00:16:A4:0A:C8:F0'),
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  }
};

var req = http.request(options, function(res)
{
  res.setEncoding('utf8');

  res.on('data', function(chunk)
  {
    process.stdout.write(chunk);
  });

  res.on('end', function()
  {
    console.log();
  });
});

req.on('error', function(err)
{
  console.log(err.message);
});

req.end(postData);
