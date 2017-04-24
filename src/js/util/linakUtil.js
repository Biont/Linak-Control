import Sudo from 'sudo-prompt'  ;
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
		let exec = require( 'child_process' ).exec;
		console.log( process.cwd() );
		console.log( __dirname );
		exec( 'pwd', function( error, stdout, stderr ) {
			// command output is in stdout
			console.log( arguments );
		} );
		Sudo.exec( __dirname + '/bin/example-moveTo ' + position, this.options, function( error, stdout, stderr ) {
			console.log( arguments );
			if ( error ) {
				console.log( stderr );
			}
		} );
	}

}