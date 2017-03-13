'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./index.js');

var _lua = require('./lua');

var _lua2 = _interopRequireDefault(_lua);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var luaGetTables = (0, _lua2.default)('getTables');

var getTables = function getTables() {
  return new Promise(function (resolve, reject) {
    _index.tex.eval(luaGetTables, 0, function (err, res) {
      var tables = [];
      var keys = Object.keys(res);
      keys.forEach(function (key) {
        key = parseInt(key);
        if ((key + 1) % 2 === 1) {
          tables.push({
            tableId: res[key],
            players: res[key + 1]
          });
        }
        resolve(tables);
      });
    });
  });
};

exports.default = getTables;