import {dialog, ipcMain} from "electron";
import SchedulerLogic from "./util/schedulerLogic";
import Linak from "./util/linakUtil";
import Notifier from "node-notifier";
const namespace = 'ScheduleItem';

/**
 * Runs in the background and performs actions when needed
 */
export default class Background {
	constructor( settings ) {
		this.settings = settings;
		this.linak = new Linak();
		this.scheduler = new SchedulerLogic( this.settings.get( namespace ), [
			{
				delay   : 0,
				callback: ( item ) => {
					this.linak.moveTo( item.height, () => {
						console.log( 'Linak done firing' );
					} );
				}
			}
		] );
	}

	init() {
		let notifier = new Notifier.NotifySend();
		notifier.notify( {
			title  : 'Foo',
			message: 'Hello World',
			icon   : __dirname + '/../icons/app-128.png',

			// .. and other notify-send flags:
			urgency : void 0,
			time    : void 0,
			category: void 0,
			hint    : void 0,
		} );

		this.scheduler.boot();

		// Listen for async message from renderer process
		ipcMain.on( 'electron-settings-change', ( event, arg ) => {
			console.log( 'IPC!! SETIINGS CHANGED!', arg );
			Notifier.notify( {
				'title'  : 'My notification',
				'message': 'Hello, there!'
			} );
			this.scheduler.setData( this.settings.get( namespace ) );
			this.scheduler.enqueue();
		} );
	}

}