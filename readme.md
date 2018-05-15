# walkner-m300p

Mini300 LED gen2 sensor programmer and tester.

## Requirements

### node.js

  * __Version__: 5
  * __Website__: https://nodejs.org/
  * __Download__: https://nodejs.org/download/

## Configuration

Configuration is specified in the JSON format and is spit into three sections (JSON object properties): config, program
and test.

If the `program` property is specified, then sensor programming is executed. The sensor should be powered prior to
running the operation.

If the `test` property is specified, then sensor testing is executed. The sensor should be off prior to running
the operation, because it'll be powered on and tested using the GLP2-I tester.

If there is no `program` and `test` property, then the current sensor configuration is read and returned.

Only one operation can be executed at a time.

See the `example/` directory or open the input builder (`bin/input-builder/index.html`) in the browser for more info.

### `config`

* `.deviceMac` - MAC address of the sensor.
* `.devicePin` - Bluetooth PIN used to connect to the sensor.
* `.factoryPassword` - password used to log in to the factory level during the programming operation.
* `.loginHashSeed` - seed used to generate Murmur2 hash used to log in to the factory level during
  the programming operation.
* `.testerComPort` - serial port of the GLP2-I tester (e.g. COM1). Can be also specified as `<host>:<port>`
  (e.g. `127.0.0.1:5331` if the serial port is behind a TCP proxy).
* `.responseTimeout` - maximum time in ms to wait for a response from the sensor.
* `.btConnectDelay` - time to wait after starting the functional test on the GLP2-I tester before connecting
  to the sensor.
* `.btConnectTryCount` - maximum number of times to retry to establish a Bluetooth connection.
* `.progressInterval` - minimum time between collection of the testing progress. The progress interval is increased
  by the time it takes to execute two requests to the sensor (`getStatus` and `getProgress`).
* `.logging` - determines how much logging information is produced:
  * `.error` - if enabled, then the error message returned in case of failure contains an error message and stack trace
    (otherwise - only message).
  * `.conn` - determines whether events related to connection management should be written to the standard error stream
    (stderr).
  * `.txrx` - determines whether buffers sent to and received from the sensor and the GLP2-I tester should be written
    to the stderr.
  * `.reqres` - determines whether request and response objects sent to and received from the sensor should be written
    to the stderr (req/res objects are human readable representations of the tx/rx buffers).

## Usage

The program can be run in three modes: HTTP server, stdin, file. The execution mode is determined by the required
`--input` command line argument.

Also, all properties of the `config` object can be specified as command line arguments and override any values
specified in the input JSON. The arguments can be specified in the camelCase (e.g. `--loginHashSeed`) or dash-case
(e.g. `--login-hash-seed`).

### File mode

This mode is used if a path to a JSON file is specified in the `--input` argument (i.e. a string ending with `.json`).

For example:
```
.\bin\m300p --input .\example\input.test.json --device-mac 00:00:00:00:00:00
```

### Standard input (stdin)

This mode is used if `-` character is specified in the `--input` argument. Program waits for a single `data` event from
the stdin. The data should be a valid JSON.

For an example of writing to stdin see the `example/stdin.js` file.

```
.\bin\m300p --input - --device-mac 00:00:00:00:00:00 < .\example\input.program.json
```

### HTTP server

This mode is used if a port number or a host:port is specified in the `--input` argument. Programs listens for HTTP
requests on the specified host and port (if the host is not specified, then `127.0.0.1` is assumed).

Requests should use the POST method and contain a valid JSON in the body. Properties of the `config` object can be
specified in the query parameters.

Only one request is accepted at a time.

For an example of sending an HTTP request see the `example/request.js` file.

```
.\bin\m300p --input 127.0.0.1:1337
```

## Result handling

Logging info is written to the standard error stream (stderr).

Result is written to the standard output stream and is a JSON object. If the operation succeeded the process
exists with code `0` (or an HTTP response code `200`), if fails - code `1` (or an HTTP response code greater than
or equal to `400`).

### Failure

The failure JSON object always contains three properties: reason, data and error.

The `reason` property always contains a string representing the failure reason. For example:
```json
{
  "reason": "HTTP_SERVER:BUSY",
  "data": null,
  "error": null
}
```

The `data` property may contain additional info related to the error (or `null`). For example:
```json
{
  "reason": "HTTP_SERVER:INVALID_REQUEST_METHOD",
  "data": {
    "requiredMethod": "POST",
    "actualMethod": "GET"
  },
  "error": null
}
```

The `error` property may contain error message and code (or `null`). For example:
```json
{
  "reason": "BT_CONNECT_FAILURE",
  "data": {
    "deviceMac": "00:00:00:00:00:00",
    "devicePin": "0000"
  },
  "error": {
    "message": "Error: Cannot connect\n    at Error (native)",
    "code": null
  }
}
```

### Success

The success JSON object depends on the operation executed.

A successful `program` operation returns an empty object. For example:
```json
{}
```

A successful `test` operation returns an object with a `test` property which contains an array of test progress data.
For example:
```json
{
  "test": [
    {
      "time": 1455109721109,
      "progress": 0,
      "previewStep": "LEAD_IN",
      "lightLevel": 0,
      "setValue": 90,
      "actualValue": 1,
      "unit": "W"
    },
    {
      "time": 1455109731109,
      "progress": 50,
      "previewStep": "HIGH_LEVEL",
      "lightLevel": 100,
      "setValue": 90,
      "actualValue": 90.1,
      "unit": "W"
    },
    {
      "time": 1455109741109,
      "progress": 100,
      "previewStep": "LEAD_OUT",
      "lightLevel": 30,
      "setValue": 90,
      "actualValue": 30,
      "unit": "W"
    }
  ]
}
```

## Progress monitoring

Progress can be monitored by reading the standard error stream and finding strings matching the following regular
expression: `\n% ([0-9]+)\n` (first group is the progress percentage).

Example of program output:
```
>>>> 16-02-10 14:16:22.732+01 Starting...
>>>> 16-02-10 14:16:22.815+01 Reading input from file: .\example\input.program.json
>>>> 16-02-10 14:16:22.820+01 Connecting...
% 8
>>>> 16-02-10 14:16:22.822+01 [BtConf#starting]
>>>> 16-02-10 14:16:22.879+01 [BtConf] 001 Radio Name=MSYS
>>>> 16-02-10 14:16:22.881+01 [BtConf] 002 Radio LocalAddress=0015830CBFEB
>>>> 16-02-10 14:16:22.882+01 [BtConf] 003 Radio Manufacturer=CambridgeSiliconRadio
>>>> 16-02-10 14:16:22.883+01 [BtConf] 004 Radio SoftwareManufacturer=Microsoft
>>>> 16-02-10 14:16:22.885+01 [BtConf] 005 Radio HardwareStatus=Running
>>>> 16-02-10 14:16:22.887+01 [BtConf] 006 Radio Mode=PowerOff
% 17
% 25
>>>> 16-02-10 14:16:22.897+01 [led4uc2#opening] { macAddress: '00:00:00:00:00:00', channel: 1 }
>>>> 16-02-10 14:16:22.901+01 [led4uc2#openingFailed] Cannot connect
>>>> 16-02-10 14:16:22.901+01 Cleaning up...
% 31
% 36
>>>> 16-02-10 14:16:22.903+01 [BtConf#closing]
>>>> 16-02-10 14:16:22.907+01 [BtConf#closed]
% 42
>>>> 16-02-10 14:16:22.908+01 [led4uc2#unpairing] { macAddress: '00:00:00:00:00:00' }
>>>> 16-02-10 14:16:23.002+01 [led4uc2#unpaired]
% 47
% 53
% 58
>>>> 16-02-10 14:16:23.004+01 Finished in 0.282s with an error: BT_CONNECT_FAILURE
{
  "reason": "BT_CONNECT_FAILURE",
  "data": {
    "deviceMac": "00:00:00:00:00:00",
    "devicePin": "0000"
  },
  "error": {
    "message": "Error: Cannot connect",
    "code": null
  }
}
```

## License

This project is released under the [CC BY-NC-SA 4.0](https://raw.github.com/morkai/walkner-m300p/master/license.md).

Copyright (c) 2016, Łukasz Walukiewicz (lukasz@miracle.systems)
