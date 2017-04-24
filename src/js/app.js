import AppView from "./backbone/Views/AppView";
import PersistentDataCollection from "./backbone/Collections/PersistentDataCollection.js";
import ScheduleItem from "./backbone/Models/ScheduleItem";

const Linak = require( './util/linakUtil.js' );
class App {
	/**
	 * Configure the sudo prompt
	 */
	constructor() {
	}

	init() {
		let schedule = new PersistentDataCollection( {
			model: ScheduleItem
		} );
		let appView = new AppView( {
			el        : '#main-app',
			collection: schedule
		} );
		schedule.fetch();
		appView.render();
		// let linak = new Linak();
		// linak.moveTo( 60 );
	}
}
module.exports = App;
