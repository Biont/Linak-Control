import {dialog, ipcMain} from "electron";
import SchedulerLogic from "./util/schedulerLogic";
import Linak from "./util/linakUtil";
const settings = require( 'electron-settings' );

const namespace = 'ScheduleItem';

/**
 * Runs in the background and performs actions when needed
 */
export default class Background {
	constructor() {
		this.settings = settings;
		this.linak = new Linak();
		this.scheduler = new SchedulerLogic( this.settings.get( namespace ), [
			{
				delay   : 0,
				callback: ( item ) => {
					console.log( 'this.linak.moveTo(' + item.height + ')' );

					// this.linak.moveTo(item.height, () => {
					//     console.log('Linak done firing');
					// });
				}
			}
		] );
	}

	init() {

		this.scheduler.boot();

		// Listen for async message from renderer process
		this.settings.watch( namespace, ( event, arg ) => {
			// ipcMain.on('electron-settings-change', (event, arg) => {
			console.log( 'IPC!! SETIINGS CHANGED!', arg );
			console.log( this.settings.get( namespace ) );
			this.scheduler.setData( settings.get( namespace ) );
			this.scheduler.enqueue();
		} );
	}

}