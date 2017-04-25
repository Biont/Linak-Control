import AppView from "./backbone/Views/AppView";
import ScheduleCollection from "./backbone/Collections/ScheduleCollection.js";
import ScheduleItem from "./backbone/Models/ScheduleItem";

class App {
    /**
     * Configure the sudo prompt
     */
    constructor() {
    }

    init() {
        let schedule = new ScheduleCollection({
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
        // let linak = new Linak();
        // linak.moveTo( 60 );
    }
}
module.exports = App;
