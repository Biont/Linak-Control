import {dialog, ipcMain, Notification} from "electron";
import SchedulerLogic from "./util/schedulerLogic";
import Linak from "./util/linakUtil";
const settings = require( 'electron-settings' );

const namespace = 'ScheduleItem';

/**
 * Runs in the background and performs actions when needed
 */
export default class Background {
	constructor() {
		this.notificationSubscribers = [];
		this.linak = new Linak();
		this.scheduler = new SchedulerLogic( settings.get( namespace ), [

			{
				delay   : -2 * 60 * 1000,
				callback: ( item ) => {
					let data = {
						message: 'We will move the table in 2 minutes'
					};
					this.sendNotification( data );
					console.log( data );
				}
			},
			{
				delay   : -30 * 1000,
				callback: ( item ) => {
					let data = {
						message: 'We will move the table in 30 seconds'
					};
					this.sendNotification( data );
					console.log( data );
				}
			},
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
		ipcMain.on( 'subscribe-notifications', ( event ) => {
			this.notificationSubscribers.push( event.sender );
		} );
		this.scheduler.boot();

		// Listen for async message from renderer process
		// this.settings.watch( namespace, ( event, arg ) => {
		ipcMain.on( 'electron-settings-change', ( event, request ) => {
			let response;
			switch ( request.method ) {
				case 'read':
					response = settings.get( request.key ) || {};
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
			console.log( settings.get( namespace ) );
			this.scheduler.setData( settings.get( namespace ) );
			this.scheduler.enqueue();

			event.sender.send( request.replyContext, response );
		} );
	}

	sendNotification( data ) {
		console.log( this.notificationSubscribers );
		console.log( 'sending notifications' );
		this.notificationSubscribers.forEach( ( element, index, array ) => {
			element.send( 'notify', data );

		} );

	}

}