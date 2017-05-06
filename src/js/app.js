import {Renderer as background} from "./util/ipcHandler";
import AppSettingsModel from "./backbone/Models/AppSettings";
import AppView from "./backbone/Views/AppView";
import ScheduleCollection from "./backbone/Collections/ScheduleCollection.js";
import ScheduleItem from "./backbone/Models/ScheduleItem";

class App {

    init() {
        this.listenToNotifications();
        this.settings = new AppSettingsModel({
            id: 'mainApp',
            heightOffset: 62.5,
            maxHeight: 6449,
            autoStart: false,
            enableStatistics: true
        });
        this.settings.fetch({
            success: () => {
                appView.render();
            }
        });
        let schedule = new ScheduleCollection([], {
            model: ScheduleItem,
            comparator: function (m) {
                return m.getTimeStamp();
            }
        });
        let appView = new AppView({
            el: '#main-app',
            settings: this.settings,
            collection: schedule
        });
        schedule.fetch();
    }

    listenToNotifications() {
        background.subscribe('subscribe-notifications', (event, data) => {
            let notification = new Notification('Linak Control', {
                body: data.message
            });
        });
    }
}
module.exports = App;
