// Part of <http://miracle.systems/p/walkner-m300p> licensed under <CC BY-NC-SA 4.0>

'use strict';

var inherits = require('util').inherits;
var SetPreview = require('./SetPreview');

module.exports = SetPirPreview;

/**
 * @constructor
 * @extends {SetPreview}
 * @param {number} leadInTime
 * @param {number} fadeInTime
 * @param {number} highLevel
 * @param {number} highTime
 * @param {number} fadeOutTime
 * @param {number} lowLevel
 * @param {boolean} shutDown
 * @param {number} leadOutTime
 */
function SetPirPreview(leadInTime, fadeInTime, highLevel, highTime, fadeOutTime, lowLevel, shutDown, leadOutTime)
{
  SetPreview.call(this, 'H', leadInTime, fadeInTime, highLevel, highTime, fadeOutTime, lowLevel, shutDown, leadOutTime);
}

inherits(SetPirPreview, SetPreview);

/**
 * @param {object} obj
 * @param {number} obj.leadInTime
 * @param {number} obj.fadeInTime
 * @param {number} obj.highLevel
 * @param {number} obj.highTime
 * @param {number} obj.fadeOutTime
 * @param {number} obj.lowLevel
 * @param {boolean} obj.shutDown
 * @param {number} obj.leadOutTime
 * @returns {SetFixPreview}
 * @throws {Error} If any property is invalid.
 */
SetPirPreview.fromObject = function(obj)
{
  return SetPreview.fromObject(SetPirPreview, obj);
};
