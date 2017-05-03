import {exec} from "child_process";
import EventEmitter from "events";
const errorCodes = {
	//Libusb
	LIBUSB_SUCCESS            : 0,
	LIBUSB_ERROR_IO           : -1,
	LIBUSB_ERROR_INVALID_PARAM: -2,
	LIBUSB_ERROR_ACCESS       : -3,
	LIBUSB_ERROR_NO_DEVICE    : -4,
	LIBUSB_ERROR_NOT_FOUND    : -5,
	LIBUSB_ERROR_BUSY         : -6,
	LIBUSB_ERROR_TIMEOUT      : -7,
	LIBUSB_ERROR_OVERFLOW     : -8,
	LIBUSB_ERROR_PIPE         : -9,
	LIBUSB_ERROR_INTERRUPTED  : -10,
	LIBUSB_ERROR_NO_MEM       : -11,
	LIBUSB_ERROR_NOT_SUPPORTED: -12,
	LIBUSB_ERROR_OTHER        : -99,
	OK                        : 0,
	// Linak driver
	//startup
	ARGS_MISSING              : 100,
	ARGS_WRONG                : 100,
	//device
	DEVICE_CANT_FIND          : 200,
	DEVICE_CANT_OPEN          : 200,
	DEVICE_CANT_INIT          : 200,
	//
	MESSAGE_ERROR             : 300,
	//Custom
	DEVICE_BUSY               : 250,
	PERMISSION_DENIED         : 201
};

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

	poll( flag = true ) {
		if ( this.polling && flag ) {
			console.log( 'already polling', this.polling );
			return;
		}
		this.polling = this.polling || true;
		exec( __dirname + '/bin/example-getHeight', ( error, stdout, stderr ) => {

			if ( !error ) {
				console.error( 'DEVICE FOUND' );
				this.deviceFound = true;

				this.trigger( 'deviceFound' );
				return;
			}

			this.handleError( error );

			clearTimeout( this.pollingTimeout );
			this.polling = false;
			this.pollingTimeout = setTimeout( () => {
				this.poll( false )
			}, 1500 );
		} );

	}

	hasDevice() {
		return this.deviceFound;
	}

	on( handle, callback ) {
		this.events.on( handle, callback );
	}

	trigger( handle, args ) {
		this.events.emit( handle, args );
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
		// try {
		exec( __dirname + '/bin/example-getHeight', ( error, stdout, stderr ) => {
			if ( error ) {
				this.handleError( error );
			}
			let parts = stdout.split( /[\n\s]+/ );
			let data = {
				signal: parts[ 2 ],
				cm    : parts[ 3 ].slice( 0, -2 ),
				raw   : stdout
			};
			callback( error, data )
		} );
		// } catch ( ex ) {
		// 	console.error( 'getHeight error ' + ex.code, ex.toString() );
		// 	console.error( 'getHeight error ' + ex.errno, ex.signal );
		//
		// }

	}

	handleError( error ) {
		console.error( `Error code ${error.code}, signal ${error.signal}: ${error}` );
		switch ( error.code ) {
			case errorCodes.DEVICE_CANT_FIND:
			case errorCodes.DEVICE_CANT_INIT:
			case errorCodes.DEVICE_CANT_OPEN: {
				console.error( `Cannot talk to device: ${error}` );
				this.trigger( 'deviceLost' );
				this.poll();
				break;
			}
			case errorCodes.DEVICE_BUSY:
				console.error( `Device is currently busy: ${error}` );
				break;
			case errorCodes.PERMISSION_DENIED:
				console.error( 'Permission Problem' );
				this.trigger( 'permissionProblem', error );
				this.poll();

		}

	}

}