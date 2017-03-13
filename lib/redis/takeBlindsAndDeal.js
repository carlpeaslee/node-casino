'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./index.js');

var _lua = require('./lua');

var _lua2 = _interopRequireDefault(_lua);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var luaTakeBlindsAndDeal = (0, _lua2.default)('takeBlindsAndDeal');

var takeBlindsAndDeal = function takeBlindsAndDeal(tableId, deck) {
  return new Promise(function (resolve, reject) {
    _index.tex.eval.apply(_index.tex, [luaTakeBlindsAndDeal, 1, tableId].concat(_toConsumableArray(deck), [function (err, res) {
      console.log('takeBlindsAndDeal', res, err);

      resolve();
    }]));
  });
};

exports.default = takeBlindsAndDeal;