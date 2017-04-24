"use strict";

var _AppView = require("./backbone/Views/AppView");

var _AppView2 = _interopRequireDefault(_AppView);

var _PersistentDataCollection = require("./backbone/Collections/PersistentDataCollection.js");

var _PersistentDataCollection2 = _interopRequireDefault(_PersistentDataCollection);

var _ScheduleItem = require("./backbone/Models/ScheduleItem");

var _ScheduleItem2 = _interopRequireDefault(_ScheduleItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Linak = require('./util/linakUtil.js');

var App = function () {
    /**
     * Configure the sudo prompt
     */
    function App() {
        _classCallCheck(this, App);
    }

    App.prototype.init = function init() {
        var schedule = new _PersistentDataCollection2.default({
            model: _ScheduleItem2.default,
            comparator: function comparator(m) {
                return -Date.parse(m.get('time'));
            }
        });
        var appView = new _AppView2.default({
            el: '#main-app',
            collection: schedule
        });
        schedule.fetch();
        appView.render();
        // let linak = new Linak();
        // linak.moveTo( 60 );
    };

    return App;
}();

module.exports = App;
//# sourceMappingURL=app.js.map
