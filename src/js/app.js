import {ipcRenderer, remote} from "electron";
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
		this.listenToNotifications();

		let schedule = new ScheduleCollection( [], {
			model     : ScheduleItem,
			comparator: function( m ) {
				return m.getTimeStamp();
			}
		} );
		let appView = new AppView( {
			el        : '#main-app',
			collection: schedule
		} );
		schedule.fetch();
		appView.render();
	}

	listenToNotifications() {
		ipcRenderer.send( 'subscribe-notifications' );
		ipcRenderer.on( 'notify', ( event, data ) => {
			let notification = new Notification( 'Linak Control', {
				body: data.message
			} );
		} );

	}
}
module.exports = App;
