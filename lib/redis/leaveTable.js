'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./index.js');

var _lua = require('./lua');

var _lua2 = _interopRequireDefault(_lua);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var luaLeaveTable = (0, _lua2.default)('leaveTable');

var leaveTable = function leaveTable(tableId, user) {
  return new Promise(function (resolve, reject) {
    _index.tex.eval(luaLeaveTable, 1, tableId, user, tableId, function (err, res) {

      resolve();
    });
  });
};

exports.default = leaveTable;