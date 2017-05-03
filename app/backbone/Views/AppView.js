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

var _AppSettingsView = require("./AppSettingsView");

var _AppSettingsView2 = _interopRequireDefault(_AppSettingsView);

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

var _LinakListView = require("./LinakListView.js");

var _LinakListView2 = _interopRequireDefault(_LinakListView);

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

		_this2.settings = data.settings;
		_this2.collection = data.collection;
		_this2.deviceFound = false;
		_this2.showingAlert = false;
		_ipcHandler.Renderer.subscribe('deviceFound', function () {
			return _this2.onDeviceFound();
		});
		_ipcHandler.Renderer.subscribe('deviceLost', function () {
			return _this2.onDeviceLost();
		});
		_ipcHandler.Renderer.subscribe('alert', function (event, alert) {
			return _this2.onNotification(alert);
		});

		//Debug
		// this.devShim();

		_this2.listenTo(_this2.collection, 'empty', _this2.open);

		_ipcHandler.Renderer.emit('rendererReady');
		return _this2;
	}

	AppView.prototype.onClickAction = function onClickAction(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		var action = jQuery(e.currentTarget).data('action');
		switch (action) {
			case 'settings':
				this.openSettings();
				break;
			case 'remove':
				this.model.destroy();
		}
	};

	AppView.prototype.openSettings = function openSettings() {
		var _this3 = this;

		var modal = new _ModalView2.default({
			header: 'Settings',
			closeBtnText: 'Save',
			subViews: {
				content: function content() {
					return new _AppSettingsView2.default({
						model: _this3.settings
					});
				}

			}
		});

		modal.render();
		this.listenTo(modal, 'remove:button', function () {
			this.settings.save();
			this.render(true);
		});
	};

	AppView.prototype.devShim = function devShim() {
		var that = this;
		var delay = 4000;

		function lost() {
			that.onDeviceLost();
			setTimeout(function () {
				found();
			}, delay);
		}

		function found() {
			that.onDeviceFound();

			setTimeout(function () {
				lost();
			}, delay);
		}

		setTimeout(function () {
			found();
		}, delay);
	};

	AppView.prototype.onDeviceFound = function onDeviceFound() {
		console.log('device found');
		this.deviceFound = true;
		if (this.searchModal) {
			this.searchModal.remove();
			delete this.searchModal;
		}
		this.render();
	};

	AppView.prototype.onDeviceLost = function onDeviceLost() {
		console.log('device lost');
		this.deviceFound = false;
		this.render();
	};

	AppView.prototype.render = function render() {
		var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		console.log(this.settings);
		// super.render();return;
		if (!this.deviceFound) {
			if (!this.searchModal) {
				this.openSearchModal();
			}
		} else {
			_BiontView$extend.prototype.render.call(this, force);
		}
	};

	AppView.prototype.onNotification = function onNotification(alert) {
		console.log('receiving alert');
		if (this.showingAlert) {
			return;
		}
		console.error(alert);
		var modal = new _ModalView2.default({
			header: alert.title,
			subViews: {
				content: function content() {
					return new _TextView2.default({
						text: alert.message
					});
				}

			}
		});
		modal.render();
		this.showingAlert = true;
		this.listenTo(modal, 'remove:button', function () {
			this.showingAlert = false;
		});
	};

	AppView.prototype.openSearchModal = function openSearchModal() {
		this.searchModal = new _OverlayView2.default({
			header: 'Waiting for Device...',
			closeBtnText: 'Save',
			subViews: {
				content: function content() {
					return new _SearchDeviceView2.default({
						text: 'The USB driver could not find the device. Please connect the USB2LIN06 cable with your computer'
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
		var _this4 = this;

		var confirm = new _ConfirmView2.default({
			header: 'Are you sure?',
			subViews: {
				content: new _TextView2.default({
					text: 'This will wipe ALL application data. Are you sure?'
				})

			},
			confirm: function confirm() {
				console.log('DELETING EVERYTHING!!');
				var store = require('electron').remote.require('electron-settings');
				store.deleteAll();
				_this4.collection.fetch();
			}
		});

		confirm.render();
	};

	return AppView;
}(_BiontView2.default.extend({
	events: {
		"click [data-add]": "open",
		"click [data-delete-all]": "deleteAll",
		"click [data-action]": "onClickAction"
	}, subViews: {
		schedule: function schedule(_this) {
			return new _LinakListView2.default({
				settings: _this.settings,
				view: _ScheduleItemView2.default,
				collection: _this.collection
			});
		},
		tableHeight: function tableHeight(_this) {
			return new _TableHeightView2.default({
				settings: _this.settings
			});
		},
		tableStatistics: function tableStatistics() {
			return new _TableStatisticsView2.default();
		}
	}
}));

exports.default = AppView;
;
//# sourceMappingURL=AppView.js.map
