"use strict";

exports.__esModule = true;

var _child_process = require("child_process");

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var errorCodes = {
	//Libusb
	LIBUSB_SUCCESS: 0,
	LIBUSB_ERROR_IO: -1,
	LIBUSB_ERROR_INVALID_PARAM: -2,
	LIBUSB_ERROR_ACCESS: -3,
	LIBUSB_ERROR_NO_DEVICE: -4,
	LIBUSB_ERROR_NOT_FOUND: -5,
	LIBUSB_ERROR_BUSY: -6,
	LIBUSB_ERROR_TIMEOUT: -7,
	LIBUSB_ERROR_OVERFLOW: -8,
	LIBUSB_ERROR_PIPE: -9,
	LIBUSB_ERROR_INTERRUPTED: -10,
	LIBUSB_ERROR_NO_MEM: -11,
	LIBUSB_ERROR_NOT_SUPPORTED: -12,
	LIBUSB_ERROR_OTHER: -99,
	OK: 0,
	// Linak driver
	//startup
	ARGS_MISSING: 100,
	ARGS_WRONG: 100,
	//device
	DEVICE_CANT_FIND: 200,
	DEVICE_CANT_OPEN: 200,
	DEVICE_CANT_INIT: 200,
	//
	MESSAGE_ERROR: 300,
	//Custom
	DEVICE_BUSY: 250,
	PERMISSION_DENIED: 201
};

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

		var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

		if (this.polling && flag) {
			console.log('already polling', this.polling);
			return;
		}
		this.polling = this.polling || true;
		(0, _child_process.exec)(__dirname + '/bin/example-getHeight', function (error, stdout, stderr) {

			if (!error) {
				console.error('DEVICE FOUND');
				_this.deviceFound = true;

				_this.trigger('deviceFound');
				return;
			}

			_this.handleError(error);

			clearTimeout(_this.pollingTimeout);
			_this.polling = false;
			_this.pollingTimeout = setTimeout(function () {
				_this.poll(false);
			}, 1500);
		});
	};

	LinakUtil.prototype.hasDevice = function hasDevice() {
		return this.deviceFound;
	};

	LinakUtil.prototype.on = function on(handle, callback) {
		this.events.on(handle, callback);
	};

	LinakUtil.prototype.trigger = function trigger(handle, args) {
		this.events.emit(handle, args);
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

		// try {
		(0, _child_process.exec)(__dirname + '/bin/example-getHeight', function (error, stdout, stderr) {
			if (error) {
				_this3.handleError(error);
			}
			var parts = stdout.split(/[\n\s]+/);
			var data = {
				signal: parts[2],
				cm: parts[3].slice(0, -2),
				raw: stdout
			};
			callback(error, data);
		});
		// } catch ( ex ) {
		// 	console.error( 'getHeight error ' + ex.code, ex.toString() );
		// 	console.error( 'getHeight error ' + ex.errno, ex.signal );
		//
		// }
	};

	LinakUtil.prototype.handleError = function handleError(error) {
		console.error("Error code " + error.code + ", signal " + error.signal + ": " + error);
		switch (error.code) {
			case errorCodes.DEVICE_CANT_FIND:
			case errorCodes.DEVICE_CANT_INIT:
			case errorCodes.DEVICE_CANT_OPEN:
				{
					console.error("Cannot talk to device: " + error);
					this.trigger('deviceLost');
					this.poll();
					break;
				}
			case errorCodes.DEVICE_BUSY:
				console.error("Device is currently busy: " + error);
				break;
			case errorCodes.PERMISSION_DENIED:
				console.error('Permission Problem');
				this.trigger('permissionProblem', error);
				this.poll();

		}
	};

	return LinakUtil;
}();

exports.default = LinakUtil;
//# sourceMappingURL=linakUtil.js.map
