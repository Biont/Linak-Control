import {exec} from "child_process";
export default class LinakUtil {
	/**
	 * Configure the sudo prompt
	 */
	constructor() {

		this.options = {
			name: 'Electron',
			icns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
		};

	}

	/**
	 * Execute the elevated call to the USB driver
	 *
	 * @param position
	 * @param callback
	 */
	moveTo( position = 0, callback ) {
		console.log( 'Attempting to move the table to position ' + position );

		exec( __dirname + '/bin/example-moveTo ' + position, function( error, stdout, stderr ) {
			console.log( arguments );
			if ( error ) {
				console.log( stderr );
			}
			this.busy=false;
			callback( error, stdout, stderr )
		} );
	}

	getHeight( callback ) {
		exec( __dirname + '/bin/example-getHeight', ( error, stdout, stderr ) => {
			if ( error ) {
				console.error( `exec error: ${error}` );
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

}