import Linak from'./linakUtil.js';


export default class SchedulerLogic {
    constructor(schedule, linak) {
        this.linak = linak || new Linak();
        this.schedule = schedule;
        this.cmpDate = this.setCmpDateToNow();
    }

    boot() {

        this.enqueue();

    }

    getNextTimeDifference() {

        let nextItem = this.schedule.findWhere((model) => {
            console.log('this', model.getTimeStamp());
            console.log('cmpDate', this.cmpDate);
            return model.getTimeStamp() > this.cmpDate;
        });
        if (nextItem) {
            return nextItem.getTimeStamp() - this.cmpDate;
        }
        return false;
    }

    enqueue() {

        //Cleanup
        if (this.curTimeout) {
            clearInterval(this.curTimeout);
        }
        let diff;
        if (diff = this.getNextTimeDifference()) {
            console.log('setting new timeout', diff);
            this.curTimeout = setTimeout(() => this.timeout(), diff);

        } else {
            console.log('nothing left to do for today');
            this.setCmpDateToTomorrow();
        }
    }

    timeout() {
        this.setCmpDateToNow();
        console.log('Scheduler firing');
        this.enqueue();
    }

    setCmpDateToNow() {
        return this.cmpDate = (new Date()).getTime();
    }

    setCmpDateToTomorrow() {
        this.cmpDate = this.getTomorrowsDate();
    }

    getTomorrowsDate() {
        // sleep(1000*60*60*24);
        // getCurrentDate();
        let time = new Date();
        time.setHours('00');
        time.setMinutes('00');
        time.setSeconds('00');
        time.setDate(time.getDate() + 1)
        return time.getTime();
    }
}