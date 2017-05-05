import {dialog, ipcMain} from "electron";
import {Main as subscriptions} from "./util/ipcHandler";
import SchedulerLogic from "./util/schedulerLogic";
import Linak from "./util/linakUtil";
import Statistics from "./statistics";
const settings = require( 'electron-settings' );

const namespace = 'ScheduleItem';

const deviceFound = 'deviceFound';
const deviceLost = 'deviceLost';
const notificationKey = 'notifications';
const alertKey = 'alert';
const tableHeightKey = 'table-height';
const statisticsKey = 'app-statistics';
const windowHiddenKey = 'windowHidden';
const windowShownKey = 'windowShown';

const heightTickRate = 1000;
const statisticsTickRate = 1000;

/**
 * Runs in the background and performs actions when needed
 */
export default class Background {
	constructor( window ) {
		this.window = window;
		this.linak = new Linak();
		this.rendererReady = false;

		this.statistics = new Statistics( settings, 'AppStatistics' );
		this.scheduler = new SchedulerLogic( settings.get( namespace ), [

			{
				delay   : -2 * 60 * 1000,
				callback: ( item ) => {
					let data = {
						message: 'We will move the table in 2 minutes'
					};
					subscriptions.trigger( notificationKey, data );
					console.log( data );
				}
			},
			{
				delay   : -30 * 1000,
				callback: ( item ) => {
					let data = {
						message: 'We will move the table in 30 seconds'
					};
					subscriptions.trigger( notificationKey, data );
					console.log( data );
				}
			},
			{
				delay   : 0,
				callback: ( item ) => {
					console.log( 'this.linak.moveTo(' + item.height + ')' );
					this.moveTable( item.height );

				}
			}
		] );
	}

	moveTable( height ) {
		this.linak.moveTo( height, ( error, stdout, stderr ) => {
			// if ( error ) {
			// 	dialog.showMessageBox( {
			// 		title  : 'Could not communicate with USB driver',
			// 		message: `Error code ${error.code}, signal ${error.signal}: ${error}`
			// 	} );
			// }

		} );
	}

	init() {
		console.log( settings.getAll() );
		subscriptions.register( windowHiddenKey );
		subscriptions.register( windowShownKey );

		subscriptions.register( deviceFound );
		subscriptions.register( deviceLost );

		subscriptions.register( notificationKey );
		subscriptions.register( tableHeightKey );
		subscriptions.register( statisticsKey );
		subscriptions.register( alertKey );

		this.window.on( 'hide', () => {
			console.log( 'windowHidden' );

			subscriptions.trigger( windowHiddenKey );

			this.stopLoop();
		} );

		this.window.on( 'show', () => {
			console.log( 'windowShown' );
			subscriptions.trigger( windowShownKey );
			this.startLoop();
		} );
		this.linak.on( 'deviceFound', () => {
			console.log( 'deciveFound' );
			subscriptions.trigger( deviceFound );
			this.scheduler.enqueue();
			this.startLoop();
		} );

		this.linak.on( 'deviceLost', () => {
			if ( this.rendererReady ) {
				subscriptions.trigger( deviceLost );
			}
			this.scheduler.dequeue();
			this.stopLoop()
		} );

		this.linak.on( 'permissionProblem', ( error ) => {
			console.log( 'sending alert' );

			if ( this.rendererReady ) {
				console.log( 'actually sending alert' );

				subscriptions.trigger( alertKey, {
					title  : 'Permission Problem',
					message: `I have found a device, but do not have permission to talk to it. This is the full error message: ${error}`
				} );
			}
		} );
		this.linak.poll();

		subscriptions.on( 'rendererReady', () => {
			this.rendererReady = true;
			if ( this.linak.hasDevice() ) {
				console.log( 'Window is ready ' + deviceFound );
				subscriptions.trigger( deviceFound );
			} else {
				console.log( 'Window is ready ' + deviceLost );
				subscriptions.trigger( deviceLost );
			}

		} );

		ipcMain.on( 'move-table', ( event, args ) => {
			this.moveTable( args.height );
		} );

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
			if ( this.linak.hasDevice() ) {
				this.scheduler.setData( settings.get( namespace ) );
				this.scheduler.enqueue();
			}

			event.sender.send( request.replyContext, response );
		} );
	}

	startLoop() {
		console.log( 'start looping' );
		this.loopInterval = setInterval( () => this.loop(), heightTickRate );
	}

	stopLoop() {
		console.log( 'stop looping' );
		clearInterval( this.loopInterval );
	}

	loop() {
		this.sendTableHeight();
		if ( this.statistics.isEnabled() ) {
			this.sendStatistics();
		}
	}

	sendTableHeight() {
		this.linak.getHeight( ( error, result ) => {
			// if ( error ) {
			// 	dialog.showMessageBox( {
			// 		title  : 'Could not communicate with USB driver',
			// 		message: `Error code ${error.code}, signal ${error.signal}: ${error}`
			// 	} );
			// 	return;
			// }
			if ( this.statistics.isEnabled() ) {
				this.statistics.addHeightTime( result.signal, heightTickRate );
				this.statistics.save();
			}

			subscriptions.trigger( tableHeightKey, result )
		} );
	}

	sendStatistics() {
		subscriptions.trigger( statisticsKey, this.statistics.getData() );
	}

}