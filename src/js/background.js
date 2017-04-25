import SchedulerLogic from "./util/schedulerLogic";
const { dialog } = require( 'electron' );
const namespace = 'ScheduleItem';
export default class Background {
	constructor( settings ) {
		this.settings = settings;
		this.scheduler = new SchedulerLogic( this.settings.get( namespace ) );
	}

	init() {

		this.settings.watch( namespace, () => {
			dialog.showMessageBox( {
				message: 'hey',
				buttons: [ 'Cancel' ]
			} );
			this.scheduler.setData( this.settings.get( namespace ) );
			this.scheduler.enqueue();
		} );

		this.scheduler.boot();
	}

}