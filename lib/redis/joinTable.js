'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./index.js');

var _lua = require('./lua');

var _lua2 = _interopRequireDefault(_lua);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var luaJoinTable = (0, _lua2.default)('joinTable');

var joinTable = function joinTable(tableId, user) {
  return new Promise(function (resolve, reject) {
    _index.tex.eval(luaJoinTable, 1, tableId, tableId, user, function (err, res) {
      // let positions = new Array(5).fill(false)
      // res.forEach( (value, index) => {
      //   if ( (index + 1) % 2 === 0 ) {
      //     positions[parseInt(value) - 1] = res[index - 1]
      //   }
      // })
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
    });
  });
};

exports.default = joinTable;