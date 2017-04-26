"use strict";

exports.__esModule = true;

var _BiontView = require("./BiontView.js");

var _BiontView2 = _interopRequireDefault(_BiontView);

var _ConfirmView = require("./ConfirmView");

var _ConfirmView2 = _interopRequireDefault(_ConfirmView);

var _ModalView = require("./ModalView");

var _ModalView2 = _interopRequireDefault(_ModalView);

var _ScheduleFormView = require("./ScheduleFormView");

var _ScheduleFormView2 = _interopRequireDefault(_ScheduleFormView);

var _TextView = require("./TextView");

var _TextView2 = _interopRequireDefault(_TextView);

var _ListView = require("./ListView.js");

var _ListView2 = _interopRequireDefault(_ListView);

var _ScheduleItemView = require("./ScheduleItemView.js");

var _ScheduleItemView2 = _interopRequireDefault(_ScheduleItemView);

var _ScheduleItem = require("../Models/ScheduleItem.js");

var _ScheduleItem2 = _interopRequireDefault(_ScheduleItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AppView = function (_BiontView$extend) {
    _inherits(AppView, _BiontView$extend);

    function AppView(data, options) {
        _classCallCheck(this, AppView);

        data.subViews = data.subViews || {
            schedule: new _ListView2.default({
                view: _ScheduleItemView2.default,
                collection: data.collection
            })
        };

        var _this = _possibleConstructorReturn(this, _BiontView$extend.call(this, data, options));

        _this.collection = data.collection;

        _this.listenTo(_this.collection, 'empty', _this.open);
        return _this;
    }

    AppView.prototype.open = function open() {
        var time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            height = 80;

        var newItem = new _ScheduleItem2.default({
            time: time, height: height
        });
        var modal = new _ModalView2.default({
            header: 'Create new Schedule Item',
            closeBtnText: 'Save',
            subViews: {
                content: new _ScheduleFormView2.default({
                    model: newItem
                })

            }
        });

        modal.render();
        this.listenTo(modal, 'remove:button', function () {
            newItem.save();
            this.collection.fetch();
        });
    };

    AppView.prototype.deleteAll = function deleteAll() {
        var _this2 = this;

        var confirm = new _ConfirmView2.default({
            header: 'Are you sure?',
            subViews: {
                content: new _TextView2.default({
                    text: 'This will wipe ALL application data. Are you sure?'
                })

            },
            confirm: function confirm() {
                console.log('DELETING EVERYTHING!!');
                return;
                var store = require('electron-settings');
                store.deleteAll();
                _this2.collection.fetch();
            }
        });

        confirm.render();
    };

    return AppView;
}(_BiontView2.default.extend({
    events: {
        "click [data-add]": "open",
        "click [data-delete-all]": "deleteAll"
    }
}));

exports.default = AppView;
;
//# sourceMappingURL=AppView.js.map
