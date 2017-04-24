"use strict";

exports.__esModule = true;

var _PersistentDataModel2 = require("./PersistentDataModel");

var _PersistentDataModel3 = _interopRequireDefault(_PersistentDataModel2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Sets up a Backbone Model to use the WP REST API
 */
var ScheduleItem = function (_PersistentDataModel) {
  _inherits(ScheduleItem, _PersistentDataModel);

  function ScheduleItem() {
    _classCallCheck(this, ScheduleItem);

    return _possibleConstructorReturn(this, _PersistentDataModel.apply(this, arguments));
  }

  return ScheduleItem;
}(_PersistentDataModel3.default);

exports.default = ScheduleItem;
//# sourceMappingURL=ScheduleItem.js.map
