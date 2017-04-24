'use strict';

exports.__esModule = true;

var _sudoPrompt = require('sudo-prompt');

var _sudoPrompt2 = _interopRequireDefault(_sudoPrompt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
		var exec = require('child_process').exec;
		console.log(process.cwd());
		console.log(__dirname);
		exec('pwd', function (error, stdout, stderr) {
			// command output is in stdout
			console.log(arguments);
		});
		_sudoPrompt2.default.exec(__dirname + '/bin/example-moveTo ' + position, this.options, function (error, stdout, stderr) {
			console.log(arguments);
			if (error) {
				console.log(stderr);
			}
		});
	};

	return LinakUtil;
}();

exports.default = LinakUtil;
//# sourceMappingURL=linakUtil.js.map
