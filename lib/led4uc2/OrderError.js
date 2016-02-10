// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var util = require('util');

var CODE_TO_MESSAGE = {
  100: 'Generic error.',
  101: 'Bad argument error.',
  200: 'External flash: communication error.',
  201: 'External flash: timeout.',
  202: 'External flash: address out of range.',
  203: 'External flash: configuration error.',
  300: 'Config: read CRC error.',
  301: 'Config: read error.',
  302: 'Config: verification error.',
  400: 'Scheduler: bad order of events.',
  401: 'Scheduler: unknown function.',
  402: 'Scheduler: no last record.',
  500: 'Bluetooth: unknown speed.',
  501: 'Bluetooth: echo response error.',
  502: 'Bluetooth: serial port response error.',
  503: 'Bluetooth: ring error.',
  504: 'Bluetooth: BTP response error.',
  505: 'Bluetooth: PIN response error.',
  506: 'Bluetooth: ATS512 response error.',
  507: 'Bluetooth: BTN response error.',
  508: 'Bluetooth: ATS593 response error.',
  509: 'Bluetooth: BTF response error.',
  510: 'Bluetooth: serial port speed switch error.',
  511: 'Bluetooth: AT&W response error.',
  512: 'Bluetooth: ATS507 response error.',
  513: 'Bluetooth: ATO response error.',
  514: 'Bluetooth: ATI4 response error.',
  515: 'Bluetooth: Set Device Class response error.',
  600: 'Auth: bad password.',
  601: 'Auth: access forbidden.',
  602: 'Auth: too many login attempts.',
  700: 'DALI: no answer.',
  701: 'DALI: first stop bit error.',
  702: 'DALI: second stop bit error.',
  703: 'DALI: start bit error.',
  704: 'DALI: wrong level of the first stop bit.',
  705: 'DALI: data bit error.',
  800: 'Internal flash: busy.',
  801: 'Internal flash: PGERR.',
  802: 'Internal flash: WRPRTERR.',
  803: 'Internal flash: timeout.',
  804: 'Internal flash: unknown value.',
  900: 'DALI: short address search in progress.',
  901: 'DALI: short address verification error.',
  902: 'DALI: incorrect number of lamps.',
  903: 'DALI: unknown search short address order.',
  1000: 'DALI: driver read in progress.',
  1001: 'DALI: driver read response error.',
  1002: 'DALI: unknown driver read order.'
};

module.exports = OrderError;

/**
 * @constructor
 * @extends {Error}
 * @param {(Request|null)} request
 * @param {(GetTaskBufferResponse|ErrorCodeResponse)} response
 */
function OrderError(request, response)
{
  Error.captureStackTrace(this, this.constructor);

  /**
   * @type {string}
   */
  this.name = this.constructor.name;

  /**
   * @type {string}
   */
  this.code = 'LED4UC2:' + response.errorCode;

  /**
   * @type {string}
   */
  this.message = '(' + response.errorCode + ') ' + CODE_TO_MESSAGE[response.errorCode];

  /**
   * @type {(Request|null)}
   */
  this.request = request;

  /**
   * @type {(GetTaskBufferResponse|ErrorCodeResponse)}
   */
  this.response = response;
}

util.inherits(OrderError, Error);
