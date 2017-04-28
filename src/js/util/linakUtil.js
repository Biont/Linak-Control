import {exec, execSync} from "child_process";
import EventEmitter from "events";
export default class LinakUtil {
	/**
	 * Configure the sudo prompt
	 */
	constructor() {
		this.callbacks = {};
		this.deviceFound = false;
		// this.devicePermissions = false;
		this.deviceBusy = false;
		this.events = new EventEmitter;
		this.queue = [];
	}

	poll() {
		this.polling = setInterval( () => {
			let result = execSync( __dirname + '/bin/example-getHeight' ).toString();
			if ( result ) {
				console.error( 'DEVICE FOUND' );
				this.deviceFound = true;
				clearInterval( this.polling );
				this.trigger( 'deviceFound' );
			}
		}, 1500 )
	}

	hasDevice() {
		return this.deviceFound;
	}

	on( handle, callback ) {
		this.events.on( handle, callback );
	}

	trigger( handle ) {
		this.events.emit( handle );
	}

	/**
	 * Execute the elevated call to the USB driver
	 *
	 * @param position
	 * @param callback
	 */
	moveTo( position = 0, callback ) {
		console.log( 'Attempting to move the table to position ' + position );
		exec( __dirname + '/bin/example-moveTo ' + position, ( error, stdout, stderr ) => {
			if ( error ) {
				this.handleError();
			}
			callback( error, stdout, stderr )
		} );
	}

	getHeight( callback ) {
		exec( __dirname + '/bin/example-getHeight', ( error, stdout, stderr ) => {
			if ( error ) {
				this.handleError( error );
			}
			let parts = stdout.split( ' ' );
			let data = {
				signal: parts[ 2 ],
				cm    : parts[ 3 ],
				raw   : stdout
			};

			callback( error, data )
		} );
	}

	handleError( error ) {
		console.error( `Error code ${error.code}, signal ${error.signal}: ${error}` );
		this.trigger( 'deviceLost' );
		this.poll();
	}

}