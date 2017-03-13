'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./index.js');

var _lua = require('./lua');

var _lua2 = _interopRequireDefault(_lua);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var luaJoinTable = (0, _lua2.default)('joinTable');

var joinTable = function joinTable(tableId, user) {
  return new Promise(function (resolve, reject) {
    _index.tex.eval(luaJoinTable, 1, tableId, tableId, user, function (err, res) {
      var positions = new Array(5).fill(false);
      res.forEach(function (value, index) {
        if ((index + 1) % 2 === 0) {
          positions[parseInt(value) - 1] = res[index - 1];
        }
      });
      resolve(positions);
    });
  });
};

exports.default = joinTable;