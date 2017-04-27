import {dialog, ipcMain, Notification} from "electron";
import SchedulerLogic from "./util/schedulerLogic";
import Linak from "./util/linakUtil";
import Statistics from "./statistics";
const settings = require( 'electron-settings' );

const namespace = 'ScheduleItem';
const heightTickRate = 1000;
const statisticsTickRate = 1000;

/**
 * Runs in the background and performs actions when needed
 */
export default class Background {
	constructor() {
		this.notificationSubscribers = [];
		this.tableHeightSubscribers = [];
		this.tableStatisticsSubscribers = [];
		this.linak = new Linak();
		this.statistics = new Statistics( settings, 'AppStatistics' );
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
					this.moveTable( item.height );

				}
			}
		] );
	}

	moveTable( height ) {
		this.linak.moveTo( height, ( error, stdout, stderr ) => {
			if ( error ) {
				dialog.showMessageBox( {
					title  : 'Could not communicate with USB driver',
					message: `exec error: ${error}`
				} );
			}

		} );
	}

	init() {

		ipcMain.on( 'move-table', ( event, args ) => {
			this.moveTable( args.height );
		} );

		ipcMain.on( 'subscribe-notifications', ( event, args ) => {
			this.notificationSubscribers.push( { sender: event.sender, reply: args.reply } );
		} );

		ipcMain.on( 'subscribe-table-height', ( event, args ) => {
			this.tableHeightSubscribers.push( { sender: event.sender, reply: args.reply } );
		} );

		ipcMain.on( 'subscribe-table-statistics', ( event, args ) => {
			this.tableStatisticsSubscribers.push( { sender: event.sender, reply: args.reply } );
		} );

		this.tableHeightInterval = setInterval( () => this.sendTableHeight(), heightTickRate );
		this.statisticsInterval = setInterval( () => this.sendStatistics(), statisticsTickRate );
		this.scheduler.enqueue();

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
			console.log( response );
			this.scheduler.setData( settings.get( namespace ) );
			this.scheduler.enqueue();

			event.sender.send( request.replyContext, response );
		} );
	}

	sendNotification( data ) {
		console.log( 'sending notifications' );
		this.notificationSubscribers.forEach( ( element, index, array ) => {
			element.sender.send( element.reply, data );

		} );

	}

	sendTableHeight() {
		this.linak.getHeight( ( error, result ) => {
			if ( error ) {
				dialog.showMessageBox( {
					title  : 'Could not communicate with USB driver',
					message: `exec error: ${error}`
				} );
				clearInterval( this.tableHeightInterval );
				clearInterval( this.statisticsInterval );
				return;
			}
			this.statistics.addHeightTime( result.signal, heightTickRate );
			this.statistics.save();
			this.notificationSubscribers.forEach( ( element, index, array ) => {
				element.sender.send( element.reply, result );

			} );
		} );
	}

	sendStatistics() {
		console.log( 'sending statistics' );
		this.tableStatisticsSubscribers.forEach( ( element, index, array ) => {
			element.sender.send( element.reply, this.statistics.getData() );

		} );
	}

}