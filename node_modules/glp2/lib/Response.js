// Copyright (c) 2015, Łukasz Walukiewicz <lukasz@miracle.systems>.
// Licensed under the MIT License <http://opensource.org/licenses/MIT>.
// Part of the node-glp2 project <http://miracle.systems/p/node-glp2>.

'use strict';

module.exports = Response;

/**
 * @constructor
 * @param {ResponseType} type
 */
function Response(type)
{
  /**
   * @type {ResponseType}
   */
  this.type = type;
}
