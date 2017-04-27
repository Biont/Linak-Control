'use strict';

exports.__esModule = true;

var _child_process = require('child_process');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LinakUtil = function () {
	/**
  * Configure the sudo prompt
  */
	function LinakUtil() {
		_classCallCheck(this, LinakUtil);

		this.options = {
			name: 'Electron',
			icns: '/Applications/Electron.app/Contents/Resources/Electron.icns' };
	}

	/**
  * Execute the elevated call to the USB driver
  *
  * @param position
  * @param callback
  */


	LinakUtil.prototype.moveTo = function moveTo() {
		var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
		var callback = arguments[1];

		console.log('Attempting to move the table to position ' + position);

		(0, _child_process.exec)(__dirname + '/bin/example-moveTo ' + position, function (error, stdout, stderr) {
			console.log(arguments);
			if (error) {
				console.log(stderr);
			}
			this.busy = false;
			callback(error, stdout, stderr);
		});
	};

	LinakUtil.prototype.getHeight = function getHeight(callback) {
		(0, _child_process.exec)(__dirname + '/bin/example-getHeight', function (error, stdout, stderr) {
			if (error) {
				console.error('exec error: ' + error);
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

	return LinakUtil;
}();

exports.default = LinakUtil;
//# sourceMappingURL=linakUtil.js.map
