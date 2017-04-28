"use strict";

exports.__esModule = true;

var _child_process = require("child_process");

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LinakUtil = function () {
	/**
  * Configure the sudo prompt
  */
	function LinakUtil() {
		_classCallCheck(this, LinakUtil);

		this.callbacks = {};
		this.deviceFound = false;
		// this.devicePermissions = false;
		this.deviceBusy = false;
		this.events = new _events2.default();
		this.queue = [];
	}

	LinakUtil.prototype.poll = function poll() {
		var _this = this;

		this.polling = setInterval(function () {
			var result = (0, _child_process.execSync)(__dirname + '/bin/example-getHeight').toString();
			if (result) {
				console.error('DEVICE FOUND');
				_this.deviceFound = true;
				clearInterval(_this.polling);
				_this.trigger('deviceFound');
			}
		}, 1500);
	};

	LinakUtil.prototype.hasDevice = function hasDevice() {
		return this.deviceFound;
	};

	LinakUtil.prototype.on = function on(handle, callback) {
		this.events.on(handle, callback);
	};

	LinakUtil.prototype.trigger = function trigger(handle) {
		this.events.emit(handle);
	};

	/**
  * Execute the elevated call to the USB driver
  *
  * @param position
  * @param callback
  */


	LinakUtil.prototype.moveTo = function moveTo() {
		var _this2 = this;

		var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
		var callback = arguments[1];

		console.log('Attempting to move the table to position ' + position);
		(0, _child_process.exec)(__dirname + '/bin/example-moveTo ' + position, function (error, stdout, stderr) {
			if (error) {
				_this2.handleError();
			}
			callback(error, stdout, stderr);
		});
	};

	LinakUtil.prototype.getHeight = function getHeight(callback) {
		var _this3 = this;

		(0, _child_process.exec)(__dirname + '/bin/example-getHeight', function (error, stdout, stderr) {
			if (error) {
				_this3.handleError(error);
			}
			var parts = stdout.split(' ');
			var data = {
				signal: parts[2],
				cm: parts[3],
				raw: stdout
			};

			callback(error, data);
		});
	};

	LinakUtil.prototype.handleError = function handleError(error) {
		console.error("Error code " + error.code + ", signal " + error.signal + ": " + error);
		this.trigger('deviceLost');
		this.poll();
	};

	return LinakUtil;
}();

exports.default = LinakUtil;
//# sourceMappingURL=linakUtil.js.map
