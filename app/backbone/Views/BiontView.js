"use strict";

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _backbone = require("backbone");

var _backbone2 = _interopRequireDefault(_backbone);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _ejs = require("ejs");

var _ejs2 = _interopRequireDefault(_ejs);

var _TemplateHelpers = require("../TemplateHelpers");

var _TemplateHelpers2 = _interopRequireDefault(_TemplateHelpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var tplDir = '../../tpl/';

require.extensions['.ejs'] = function (module) {
	var filename = module.filename;
	var options = { filename: filename, client: true, compileDebug: true };
	var template = _fs2.default.readFileSync(filename).toString().replace(/^\uFEFF/, '');
	var fn = _ejs2.default.compile(template, options);
	return module._compile('module.exports = ' + fn.toString() + ';', filename);
};

var BiontView = function (_Backbone$View$extend) {
	_inherits(BiontView, _Backbone$View$extend);

	_createClass(BiontView, [{
		key: "template",

		/**
   * Make all BRViews use our own TemplateLoader
   *
   * @returns {*}
   */
		get: function get() {
			return this.getTemplate();
		}
	}]);

	function BiontView(data, options) {
		_classCallCheck(this, BiontView);

		var _this = _possibleConstructorReturn(this, _Backbone$View$extend.call(this, data, options));

		if (_this.constructor.name === 'BiontView') {
			throw new TypeError("Cannot construct BiontView instances directly");
		}
		return _this;
	}

	/**
  * Retrieves a template from the DOM
  *
  * @param tplOverride
  * @returns {string}
  */


	BiontView.prototype.getTemplate = function getTemplate(tplOverride) {

		var tpl = void 0;

		/**
   * Try to find a given override first
   */
		tplOverride = __dirname + '/' + tplDir + tplOverride + '.ejs';

		if (tplOverride && _fs2.default.existsSync(tplOverride)) {
			return require(tplOverride);
		}

		/**
   * Walk up the prototype chain to find matching templates
   */
		var curObject = this;
		while (curObject && curObject.constructor.name !== 'BiontView') {
			var tplModule = __dirname + '/' + tplDir + curObject.constructor.name + '.ejs';
			if (_fs2.default.existsSync(tplModule)) {
				return require(tplModule);
			}
			curObject = Object.getPrototypeOf(curObject);
		}

		console.error('Could not find template for View ' + this.constructor.name);
		return function () {
			return '<div class="tplError">MISSING TEMPLATE</div>';
		};
	};

	/**
  * Very basic render function.
  * @returns {BiontView}
  */


	BiontView.prototype.render = function render() {
		var data = this.model ? this.model.toJSON() : {};
		_.extend(data, _TemplateHelpers2.default);
		this.$el.html(this.template(data));
		return this;
	};

	/**
  * Assigns a selector within the template to a specific subview, which will then get rendered
  * @param view
  * @param selector
  */


	BiontView.prototype.assign = function assign(view, selector) {
		selector = selector || '[data-subview="' + view.constructor.name + '"]';

		var $el = void 0;

		if ($el = this.$(selector, this.$el)) {
			view.setElement($el).render();
		}
	};

	return BiontView;
}(_backbone2.default.View.extend({}));

exports.default = BiontView;
//# sourceMappingURL=BiontView.js.map
