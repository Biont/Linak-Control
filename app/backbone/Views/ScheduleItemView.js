"use strict";

exports.__esModule = true;

var _BiontView = require("./BiontView.js");

var _BiontView2 = _interopRequireDefault(_BiontView);

var _ScheduleFormView = require("./ScheduleFormView");

var _ScheduleFormView2 = _interopRequireDefault(_ScheduleFormView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScheduleItemView = function (_BiontView$extend) {
	_inherits(ScheduleItemView, _BiontView$extend);

	function ScheduleItemView(data, options) {
		_classCallCheck(this, ScheduleItemView);

		/**
   * Setup default subViews
   * @type {{form: ScheduleFormView}}
   */
		data.subViews = data.subViews || {
			form: new _ScheduleFormView2.default({
				model: data.model
			})
		};

		var _this = _possibleConstructorReturn(this, _BiontView$extend.call(this, data, options));

		_this.form = new _ScheduleFormView2.default({
			model: data.model
		});
		_this.listenTo(_this.model, 'destroy', _this.remove);
		return _this;
	}

	ScheduleItemView.prototype.onButtonClick = function onButtonClick(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		var action = jQuery(e.currentTarget).data('action');
		switch (action) {
			case 'save':
				this.save();
				break;
			case 'remove':
				this.model.destroy();
		}
	};

	ScheduleItemView.prototype.save = function save() {
		this.model.save();
	};

	/**
  * Slides up and then kills the view
  */


	ScheduleItemView.prototype.remove = function remove() {
		var _this2 = this;

		this.$el.slideUp(275, function () {
			_BiontView$extend.prototype.remove.call(_this2);
		});
	};

	return ScheduleItemView;
}(_BiontView2.default.extend({
	events: {
		'click [data-action]': 'onButtonClick',
		'click [data-action="save"]': 'save'
	}
}));

exports.default = ScheduleItemView;
//# sourceMappingURL=ScheduleItemView.js.map
