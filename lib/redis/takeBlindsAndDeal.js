'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./index.js');

var _lua = require('./lua');

var _lua2 = _interopRequireDefault(_lua);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var luaTakeBlindsAndDeal = (0, _lua2.default)('takeBlindsAndDeal');

var takeBlindsAndDeal = function takeBlindsAndDeal(tableId, deck) {
  return new Promise(function (resolve, reject) {
    _index.tex.eval.apply(_index.tex, [luaTakeBlindsAndDeal, 1, tableId].concat(_toConsumableArray(deck), [function (err, res) {
      console.log(res);
      var gamestate = {};
      res.forEach(function (value, index) {
        if (index % 2 === 0) {
          if (Array.isArray(res[index + 1])) {
            var playerObject = {};
            res[index + 1].forEach(function (item, i) {
              if (i % 2 === 0) {
                Object.assign(playerObject, _defineProperty({}, item, res[index + 1][i + 1]));
              }
            });
            Object.assign(gamestate, _defineProperty({}, value, playerObject));
          } else {
            Object.assign(gamestate, _defineProperty({}, value, res[index + 1]));
          }
        }
      });

      resolve(gamestate);
    }]));
  });
};

exports.default = takeBlindsAndDeal;