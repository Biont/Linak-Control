'use strict';

exports.__esModule = true;

var _linakUtil = require('./linakUtil.js');

var _linakUtil2 = _interopRequireDefault(_linakUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SchedulerLogic = function () {
    function SchedulerLogic(schedule, linak) {
        _classCallCheck(this, SchedulerLogic);

        this.linak = linak || new _linakUtil2.default();
        this.schedule = schedule;
        this.cmpDate = this.setCmpDateToNow();
    }

    SchedulerLogic.prototype.boot = function boot() {

        this.enqueue();
    };

    SchedulerLogic.prototype.getNextTimeDifference = function getNextTimeDifference() {
        var _this = this;

        var nextItem = this.schedule.findWhere(function (model) {
            console.log('this', model.getTimeStamp());
            console.log('cmpDate', _this.cmpDate);
            return model.getTimeStamp() > _this.cmpDate;
        });
        if (nextItem) {
            return nextItem.getTimeStamp() - this.cmpDate;
        }
        return false;
    };

    SchedulerLogic.prototype.enqueue = function enqueue() {
        var _this2 = this;

        //Cleanup
        if (this.curTimeout) {
            clearInterval(this.curTimeout);
        }
        var diff = void 0;
        if (diff = this.getNextTimeDifference()) {
            console.log('setting new timeout', diff);
            this.curTimeout = setTimeout(function () {
                return _this2.timeout();
            }, diff);
        } else {
            console.log('nothing left to do for today');
            this.setCmpDateToTomorrow();
        }
    };

    SchedulerLogic.prototype.timeout = function timeout() {
        this.setCmpDateToNow();
        console.log('Scheduler firing');
        this.enqueue();
    };

    SchedulerLogic.prototype.setCmpDateToNow = function setCmpDateToNow() {
        return this.cmpDate = new Date().getTime();
    };

    SchedulerLogic.prototype.setCmpDateToTomorrow = function setCmpDateToTomorrow() {
        this.cmpDate = this.getTomorrowsDate();
    };

    SchedulerLogic.prototype.getTomorrowsDate = function getTomorrowsDate() {
        // sleep(1000*60*60*24);
        // getCurrentDate();
        var time = new Date();
        time.setHours('00');
        time.setMinutes('00');
        time.setSeconds('00');
        time.setDate(time.getDate() + 1);
        return time.getTime();
    };

    return SchedulerLogic;
}();

exports.default = SchedulerLogic;
//# sourceMappingURL=schedulerLogic.js.map
