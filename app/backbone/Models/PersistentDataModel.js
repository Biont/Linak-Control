'use strict';

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
 * Sets up a Backbone Model to use the WP REST API
 */

var PersistentDataModel = function (_Backbone$Model) {
	_inherits(PersistentDataModel, _Backbone$Model);

	function PersistentDataModel() {
		_classCallCheck(this, PersistentDataModel);

		return _possibleConstructorReturn(this, _Backbone$Model.apply(this, arguments));
	}

	// get url() {
	// 	console.log( 'model', this.collection.endpoint );
	// 	return this.collection.endpoint;
	// }

	PersistentDataModel.prototype.sync = function sync(method, model, options) {
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

	return PersistentDataModel;
}(Backbone.Model);

module.exports = PersistentDataModel;
//# sourceMappingURL=PersistentDataModel.js.map
