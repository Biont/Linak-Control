'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Backbone = require('backbone');

var _require = require('underscore'),
    isUndefined = _require.isUndefined,
    result = _require.result;

/** Get the Deferred status from $ if we have jQuery, otherwise use Backbone's
 *  @returns {boolean} - Whether the request was deferred
 */


function getDeferred() {
	if (Backbone.$) {
		return result(Backbone.$, 'Deferred', false);
	}
	return result(Backbone, 'Deferred', false);
}

/**
 * Created by biont on 21.04.17.
 */

var PersistentDataCollection = function (_Backbone$Collection) {
	_inherits(PersistentDataCollection, _Backbone$Collection);

	_createClass(PersistentDataCollection, [{
		key: 'url',
		get: function get() {
			var url = this.endpoint;
			if (this.requestParams !== undefined) {
				url += '/?' + this.requestParams;
			}
			return url;
		}
	}]);

	function PersistentDataCollection(args, options) {
		_classCallCheck(this, PersistentDataCollection);

		var _this = _possibleConstructorReturn(this, _Backbone$Collection.call(this, args, options));

		_this.model = args.model || Backbone.Model;
		_this.endpoint = args.endpoint;
		if (args.requestParams) {
			_this.requestParams = args.requestParams;
		}
		_this.nonces = args.nonces;
		console.log(_this.url);
		return _this;
	}

	PersistentDataCollection.prototype.sync = function sync(method, model, options) {
		var store = require('electron-settings');
		var resp = void 0,
		    errorMessage = void 0;
		var syncDfd = getDeferred();

		try {
			switch (method) {
				case 'read':
					resp = isUndefined(model.id) ? store.getAll() : store.get(model);
					break;
				case 'create':
				case 'patch':
				case 'update':
					resp = store.set(model);
					break;
				case 'delete':
					resp = store.delete(model);
					break;
			}
		} catch (error) {
			errorMessage = error.message;
		}

		if (resp) {
			if (options.success) {
				options.success.call(model, resp, options);
			}
			if (syncDfd) {
				syncDfd.resolve(resp);
			}
		} else {
			errorMessage = errorMessage ? errorMessage : 'Record Not Found';

			if (options.error) {
				options.error.call(model, errorMessage, options);
			}
			if (syncDfd) {
				syncDfd.reject(errorMessage);
			}
		}

		// add compatibility with $.ajax
		// always execute callback for success and error
		if (options.complete) {
			options.complete.call(model, resp);
		}

		return syncDfd && syncDfd.promise();
	};

	PersistentDataCollection.prototype.fetch = function fetch() {
		_Backbone$Collection.prototype.fetch.call(this, {
			add: true,
			remove: true,
			merge: true,
			data: this.queryArgs,
			success: function success() {
				console.log('fetch', arguments);
			}
		});
	};

	return PersistentDataCollection;
}(Backbone.Collection);

module.exports = PersistentDataCollection;
//# sourceMappingURL=PersistentDataCollection.js.map
