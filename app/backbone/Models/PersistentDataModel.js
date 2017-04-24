"use strict";

var _backbone = require("backbone");

var _backbone2 = _interopRequireDefault(_backbone);

var _underscore = require("underscore");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** Get the Deferred status from $ if we have jQuery, otherwise use Backbone's
 *  @returns {boolean} - Whether the request was deferred
 */
function getDeferred() {
    if (_backbone2.default.$) {
        return (0, _underscore.result)(_backbone2.default.$, 'Deferred', false);
    }
    return (0, _underscore.result)(_backbone2.default, 'Deferred', false);
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
        console.log(arguments);
        var store = require('electron-settings');
        var resp = void 0,
            errorMessage = void 0;
        var syncDfd = getDeferred();
        var key = this.getKey(model);
        var data = model.attributes;
        console.log(key);
        try {
            switch (method) {
                case 'read':
                    resp = (0, _underscore.isUndefined)(model.id) ? store.getAll() : store.get(key, data);
                    break;
                case 'create':
                case 'patch':
                case 'update':
                    resp = store.set(key, data);
                    break;
                case 'delete':
                    console.log(store.getAll());
                    console.log(store.get(key));
                    resp = store.delete(key);
                    console.log(store.get(key));
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

    PersistentDataModel.prototype.getKey = function getKey(model) {
        if ((0, _underscore.isUndefined)(model.id)) {
            model.id = model.cid;
        }
        return model.constructor.name + '.' + model.id;
    };

    return PersistentDataModel;
}(_backbone2.default.Model);

module.exports = PersistentDataModel;
//# sourceMappingURL=PersistentDataModel.js.map
