"use strict";

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
 * Created by biont on 21.04.17.
 */

var PersistentDataCollection = function (_Backbone$Collection) {
    _inherits(PersistentDataCollection, _Backbone$Collection);

    _createClass(PersistentDataCollection, [{
        key: "url",
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

        _this.model = args.model || _backbone2.default.Model;
        _this.comparator = args.comparator;
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
                    resp = (0, _underscore.isUndefined)(model.id) ? store.get(this.model.name) : store.get(model.constructor.name + '.' + model.cid);
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
        console.log(resp);
        resp = $.map(resp, function (value, index) {
            if ((0, _underscore.isUndefined)(value.id)) {
                value.id = index;
            }
            return [value];
        });
        console.log(resp);
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
        this.checkEmpty();
    };

    PersistentDataCollection.prototype.checkEmpty = function checkEmpty() {
        if (this.isEmpty()) {
            console.log('Collection is now empty');
            this.trigger('empty', this);
        }
    };

    return PersistentDataCollection;
}(_backbone2.default.Collection);

exports.default = PersistentDataCollection;
//# sourceMappingURL=PersistentDataCollection.js.map
