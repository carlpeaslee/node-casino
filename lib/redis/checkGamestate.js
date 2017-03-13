'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./index.js');

var _lua = require('./lua');

var _lua2 = _interopRequireDefault(_lua);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var luaCheckGamestate = (0, _lua2.default)('checkGamestate');

var checkGamestate = function checkGamestate(tableId) {
  return new Promise(function (resolve, reject) {
    _index.tex.eval(luaCheckGamestate, 1, tableId, function (err, res) {
      var table = {
        gamestate: false,
        activePlayer: false
      };
      res.forEach(function (value, index) {
        if (value === 'gamestate') {
          table.gamestate = res[index + 1];
        }
        if (value === 'activePlayer') {
          table.gamestate = res[index + 1];
        }
      });

      resolve(table);
    });
  });
};

exports.default = checkGamestate;