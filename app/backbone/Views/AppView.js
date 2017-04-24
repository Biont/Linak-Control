"use strict";

exports.__esModule = true;

var _BiontView = require("./BiontView.js");

var _BiontView2 = _interopRequireDefault(_BiontView);

var _ModalView = require("./ModalView");

var _ModalView2 = _interopRequireDefault(_ModalView);

var _ScheduleFormView = require("./ScheduleFormView");

var _ScheduleFormView2 = _interopRequireDefault(_ScheduleFormView);

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

var TemplateHelpers = require('../TemplateHelpers');

var AppView = function (_BiontView$extend) {
    _inherits(AppView, _BiontView$extend);

    function AppView(data, options) {
        _classCallCheck(this, AppView);

        var _this = _possibleConstructorReturn(this, _BiontView$extend.call(this, data, options));

        _this.collection = data.collection;
        _this.listView = new _ListView2.default({
            view: _ScheduleItemView2.default,
            collection: _this.collection
        });
        _this.listenTo(_this.collection, 'empty', _this.open);
        return _this;
    }

    AppView.prototype.open = function open() {
        var newItem = new _ScheduleItem2.default({
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        var modal = new _ModalView2.default({
            closeBtnText: 'Save',
            content: new _ScheduleFormView2.default({
                model: newItem
            })
        });

        modal.render();
        this.listenTo(modal, 'remove', function () {
            console.log('wooo');
            newItem.save();
            this.collection.fetch();
        });
        //
        // this.collection.create( {
        // 		time: 'hurrrrr'
        // 	},
        // 	{
        // 		wait   : true,
        // 		//TODO decouple from $author, $email and then move this in a separate class method
        // 		success: ( model, collection, raw ) => {
        // 			console.log( arguments );
        // 			// $author.val( "" );
        // 			// $email.val( "" );
        // 			// $content.val( "" );
        //
        // 			// let alert = new AlertBoxView( {
        // 			// 	'messageText'    : TemplateHelpers._e(
        // 			// 		'Your question has been posted and is awaiting moderation.' ),
        // 			// 	'closeButtonText': 'OK',
        // 			// 	// 'autoClose'      : 5000
        // 			// } );
        // 			// alert.render();
        //
        // 		},
        // 		error  : function( model, response ) {
        // 			console.log( arguments );
        // 			console.trace();
        // 		}
        // 	} );
    };

    AppView.prototype.render = function render() {
        _BiontView$extend.prototype.render.call(this);
        this.assign(this.listView, '[data-schedule]');
    };

    AppView.prototype.deleteAll = function deleteAll() {
        var store = require('electron-settings');
        store.deleteAll();
        this.collection.fetch();
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
