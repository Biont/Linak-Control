"use strict";

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _backbone = require("backbone");

var _backbone2 = _interopRequireDefault(_backbone);

var _underscore = require("underscore");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _TemplateHelpers = require("../TemplateHelpers");

var _TemplateHelpers2 = _interopRequireDefault(_TemplateHelpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var tplDir = '../../tpl/';

var BiontView = function (_Backbone$View$extend) {
	_inherits(BiontView, _Backbone$View$extend);

	_createClass(BiontView, [{
		key: "template",

		/**
   * Make all BiontViews use our own TemplateLoader
   *
   * @returns {*}
   */
		get: function get() {
			return this.getTemplate();
		}
	}]);

	function BiontView() {
		var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		_classCallCheck(this, BiontView);

		var _this = _possibleConstructorReturn(this, _Backbone$View$extend.call(this, data, options));

		if (data.subViews) {
			_this.subViews = data.subViews;
		}
		_this.subViewInstances = {};
		if (data.formatters) {
			_this.formatters = data.formatters;
		}
		_this.parent = null;
		// this.subViews = data.subViews;
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
		tplOverride = __dirname + '/' + tplDir + tplOverride + '.js';

		if (tplOverride && _fs2.default.existsSync(tplOverride)) {
			return require(tplOverride);
		}

		/**
   * Walk up the prototype chain to find matching templates
   */
		var curObject = this;
		while (curObject && curObject.constructor.name !== 'BiontView') {
			var tplModule = __dirname + '/' + tplDir + curObject.constructor.name + '.js';
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
		var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;


		if (!this.rendered || force) {
			this.$el.html(this.template(this.getTemplateData()));
			this.autoBind();
			this.rendered = true;
		}
		this.autoSubView(force);

		return this;
	};

	/**
 * Gathers all data that is passed on to the template.
 *
 * Can be overloaded by subclasses to add custom data.
 *
  * @returns {{}}
  */


	BiontView.prototype.getTemplateData = function getTemplateData() {
		var data = this.model ? this.model.toJSON() : {};
		data = this.formatData(data);

		(0, _underscore.extend)(data, _TemplateHelpers2.default);
		return data;
	};

	/**
 * Apply configured subviews to their matching template tags.
 *
 * Example:
 * // View
 * class Foo extends BiontView.extend({
 *
 *     subViews: { myView: () => new BarView() }
 *
 * }){}
 *
 * // Template
 * <div cata-subview="myView"></div>
 *
 *
  * @param forced
  */


	BiontView.prototype.autoSubView = function autoSubView(forced) {
		var _this2 = this;

		$('[data-subview]', this.$el).each(function (idx, obj) {
			var $this = $(obj),
			    data = $this.data();
			if (!data.subview) {
				console.error('empty subview attribute');
				return;
			}

			if (!_this2.subViews.hasOwnProperty(data.subview)) {
				return;
			}
			if (data.subviewparent && data.subviewparent !== _this2.cid) {
				console.log('no want');

				return;
			}

			var view = _this2.subViews[data.subview];
			var instance = _this2.subViewInstances[data.subview];
			if (instance && instance instanceof _backbone2.default.View) {
				if (!forced) {
					instance.render();
					return;
				}
				instance.remove();
				delete _this2.subViewInstances[data.subview];
			}
			if (typeof view === 'function') {
				// Support traditional and arrow functions to some extent
				view = view.call(_this2, _this2);
				view.parent = _this2;
				view.setElement($this).render(forced);
				$this.data('subviewparent', _this2.cid);
				_this2.subViewInstances[data.subview] = view;
			}
		});
	};

	/**
 * Binds model data to template tags
 *
 * Example:
 *
 * <div data-bind="name"></div> // This will keep the current value of "name" inside the container's html
 *
 * <input type='text' data-bind="name"> // This will instead set the input's value
 *
  */


	BiontView.prototype.autoBind = function autoBind() {
		var _this3 = this;

		if (!this.model) {
			return;
		}
		$('[data-bind]', this.$el).each(function (idx, obj) {
			var $this = $(obj),
			    data = $this.data();
			if (!data.bind) {
				console.error('empty tag');
				return;
			}
			switch ($this.prop('tagName')) {
				case 'INPUT':
					_this3.bindInput($this, data.bind);
					break;
				default:
					_this3.bindDefault($this, data.bind);
					break;

			}
		});
	};

	BiontView.prototype.formatData = function formatData(data) {
		var _this4 = this;

		(0, _underscore.each)(data, function (value, attr) {
			data[attr] = _this4.formatAttr(attr, value);
		});
		return data;
	};

	BiontView.prototype.formatAttr = function formatAttr(attr, data) {

		if (!this.formatters[attr]) {
			return data;
		}
		return this.formatters[attr].call(this, data, this);
	};

	BiontView.prototype.bindDefault = function bindDefault($element, attr) {
		var _this5 = this;

		$element.html(this.formatAttr(attr, this.model.get(attr)));
		this.listenTo(this.model, 'change', function (model) {
			return $element.html(_this5.formatAttr(attr, model.get(attr)));
		});
	};

	BiontView.prototype.bindInput = function bindInput($element, attr) {
		var _this6 = this;

		$element.change(function () {
			return _this6.model.set(attr, $element.val());
		});
		this.listenTo(this.model, 'change', function (model) {
			return $element.val(model.get(attr));
		});
	};

	BiontView.prototype.dump = function dump() {
		console.log(this.model);
		return JSON.stringify(this.getTemplateData());
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

	BiontView.prototype.remove = function remove() {
		this.undelegateEvents();
		_Backbone$View$extend.prototype.remove.call(this);
	};

	return BiontView;
}(_backbone2.default.View.extend({
	subViews: {},
	formatters: {}
}));

exports.default = BiontView;
//# sourceMappingURL=BiontView.js.map
