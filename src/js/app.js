import AppView from "./backbone/Views/AppView";
import PersistentDataCollection from "./backbone/Collections/PersistentDataCollection.js";
import ScheduleItem from "./backbone/Models/ScheduleItem";
import SchedulerLogic from './util/schedulerLogic.js';

class App {
    /**
     * Configure the sudo prompt
     */
    constructor() {
    }

    init() {
        let schedule = new PersistentDataCollection({
            model: ScheduleItem,
            comparator: function (m) {
                console.log('sort', m);
                console.log('parseDate', m.getTimeStamp());
                return m.getTimeStamp();
            }
        });
        let appView = new AppView({
            el: '#main-app',
            collection: schedule
        });
        schedule.fetch();
        appView.render();
        console.log(SchedulerLogic);
        let scheduler = new SchedulerLogic(schedule);
        scheduler.boot();
        // let linak = new Linak();
        // linak.moveTo( 60 );
    }
}
module.exports = App;
