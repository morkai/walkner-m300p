// Copyright (c) 2015, Łukasz Walukiewicz <lukasz@miracle.systems>.
// Licensed under the MIT License <http://opensource.org/licenses/MIT>.
// Part of the node-glp2 project <http://miracle.systems/p/node-glp2>.

'use strict';

module.exports = TestResult;

/**
 * @constructor
 * @param {string} testMethod
 * @param {number} stepNumber
 * @param {string} label
 * @param {boolean} evaluation
 */
function TestResult(testMethod, stepNumber, label, evaluation)
{
  /**
   * @type {string}
   */
  this.testMethod = testMethod;

  /**
   * @type {number}
   */
  this.stepNumber = stepNumber;

  /**
   * @type {string}
   */
  this.label = label;

  /**
   * @type {boolean}
   */
  this.evaluation = evaluation;
}
