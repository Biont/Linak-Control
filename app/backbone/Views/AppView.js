'use strict';

exports.__esModule = true;

var _BiontView = require('./BiontView.js');

var _BiontView2 = _interopRequireDefault(_BiontView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ListView = require('./ListView.js');
var TemplateHelpers = require('../TemplateHelpers');

var AppView = function (_BiontView$extend) {
	_inherits(AppView, _BiontView$extend);

	function AppView(data, options) {
		_classCallCheck(this, AppView);

		var _this = _possibleConstructorReturn(this, _BiontView$extend.call(this, data, options));

		_this.collection = data.collection;
		return _this;
	}

	AppView.prototype.open = function open() {
		console.log('wooo');

		this.collection.create({});
	};

	AppView.prototype.render = function render() {
		_BiontView$extend.prototype.render.call(this);
		// this.assign( ListView, '[data-schedule]' );
	};

	return AppView;
}(_BiontView2.default.extend({
	events: {
		"click [data-add]": "open"
	}
}));

exports.default = AppView;
;
//# sourceMappingURL=AppView.js.map
