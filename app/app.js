const Linak = require( './util/linakUtil.js' );
const AppView = require( './backbone/Views/AppView' );
const PersistentDataCollection = require( './backbone/Collections/PersistentDataCollection.js' );
const ScheduleItem = require( './backbone/Models/ScheduleItem' );
class App {
	/**
	 * Configure the sudo prompt
	 */
	constructor() {


	}

	init() {
		console.log( 'App starting!' );
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
