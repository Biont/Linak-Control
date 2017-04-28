"use strict";

exports.__esModule = true;

var _ipcHandler = require("../../util/ipcHandler");

var _BiontView = require("./BiontView.js");

var _BiontView2 = _interopRequireDefault(_BiontView);

var _ConfirmView = require("./ConfirmView");

var _ConfirmView2 = _interopRequireDefault(_ConfirmView);

var _OverlayView = require("./OverlayView");

var _OverlayView2 = _interopRequireDefault(_OverlayView);

var _ModalView = require("./ModalView");

var _ModalView2 = _interopRequireDefault(_ModalView);

var _ScheduleFormView = require("./ScheduleFormView");

var _ScheduleFormView2 = _interopRequireDefault(_ScheduleFormView);

var _TableHeightView = require("./TableHeightView");

var _TableHeightView2 = _interopRequireDefault(_TableHeightView);

var _TableStatisticsView = require("./TableStatisticsView");

var _TableStatisticsView2 = _interopRequireDefault(_TableStatisticsView);

var _SearchDeviceView = require("./SearchDeviceView");

var _SearchDeviceView2 = _interopRequireDefault(_SearchDeviceView);

var _TextView = require("./TextView");

var _TextView2 = _interopRequireDefault(_TextView);

var _ListView = require("./ListView.js");

var _ListView2 = _interopRequireDefault(_ListView);

var _ScheduleItemView = require("./ScheduleItemView.js");

var _ScheduleItemView2 = _interopRequireDefault(_ScheduleItemView);

var _ScheduleItem = require("../Models/ScheduleItem.js");

var _ScheduleItem2 = _interopRequireDefault(_ScheduleItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AppView = function (_BiontView$extend) {
	_inherits(AppView, _BiontView$extend);

	function AppView(data, options) {
		_classCallCheck(this, AppView);

		var _this2 = _possibleConstructorReturn(this, _BiontView$extend.call(this, data, options));

		_this2.collection = data.collection;
		_this2.deviceFound = false;
		_ipcHandler.Renderer.subscribe('deviceFound', function () {
			console.log('device found');
			_this2.deviceFound = true;
			if (_this2.searchModal) {
				_this2.searchModal.remove();
				delete _this2.searchModal;
			}
			_this2.render();
		});
		_ipcHandler.Renderer.subscribe('deviceLost', function () {
			console.log('device lost');
			_this2.deviceFound = false;
			_this2.render();
		});

		_this2.listenTo(_this2.collection, 'empty', _this2.open);

		_ipcHandler.Renderer.emit('rendererReady');
		return _this2;
	}

	AppView.prototype.render = function render() {
		if (!this.deviceFound) {
			console.log('searchmodal', this.searchModal);
			if (!this.searchModal) {
				this.openSearchModal();
			}
		} else {
			_BiontView$extend.prototype.render.call(this);
		}
	};

	AppView.prototype.openSearchModal = function openSearchModal() {
		this.searchModal = new _OverlayView2.default({
			header: 'Waing for Device...',
			closeBtnText: 'Save',
			subViews: {
				content: function content() {
					return new _SearchDeviceView2.default({
						text: 'Looking for Device'
					});
				}

			}
		});
		this.searchModal.render();
	};

	AppView.prototype.open = function open() {
		var time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
		    height = 80;

		var newItem = new _ScheduleItem2.default({
			time: time, height: height
		});
		var modal = new _ModalView2.default({
			header: 'Create new Schedule Item',
			closeBtnText: 'Save',
			subViews: {
				content: function content() {
					return new _ScheduleFormView2.default({
						model: newItem
					});
				}

			}
		});

		modal.render();
		this.listenTo(modal, 'remove:button', function () {
			newItem.save();
			this.collection.fetch();
		});
	};

	AppView.prototype.deleteAll = function deleteAll() {
		var _this3 = this;

		var confirm = new _ConfirmView2.default({
			header: 'Are you sure?',
			subViews: {
				content: new _TextView2.default({
					text: 'This will wipe ALL application data. Are you sure?'
				})

			},
			confirm: function confirm() {
				console.log('DELETING EVERYTHING!!');
				return;
				var store = require('electron-settings');
				store.deleteAll();
				_this3.collection.fetch();
			}
		});

		confirm.render();
	};

	return AppView;
}(_BiontView2.default.extend({
	events: {
		"click [data-add]": "open",
		"click [data-delete-all]": "deleteAll"
	}, subViews: {
		schedule: function schedule(_this) {
			return new _ListView2.default({
				view: _ScheduleItemView2.default,
				collection: _this.collection
			});
		},
		tableHeight: function tableHeight() {
			return new _TableHeightView2.default();
		},
		tableStatistics: function tableStatistics() {
			return new _TableStatisticsView2.default();
		}
	}
}));

exports.default = AppView;
;
//# sourceMappingURL=AppView.js.map
