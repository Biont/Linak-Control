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
		// this.settings.watch( namespace, ( event, arg ) => {
		ipcMain.on( 'electron-settings-change', ( event, request ) => {
			let response;
			switch ( request.method ) {
				case 'read':
					response = settings.get( request.key );
					break;
				case 'create':
				case 'patch':
				case 'update':
					settings.set( request.key, request.data );
					response = request.data;
					break;
				case 'delete':
					settings.delete( request.key );
					response = {};
					break;
			}
			console.log( 'IPC!! SETIINGS CHANGED!', event );
			console.log( this.settings.get( namespace ) );
			this.scheduler.setData( settings.get( namespace ) );
			this.scheduler.enqueue();

			event.sender.send( request.replyContext, response );
		} );
	}

}