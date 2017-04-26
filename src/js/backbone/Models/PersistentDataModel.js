import {ipcRenderer, remote} from "electron";
import Backbone from "backbone";
import {isUndefined, result} from "underscore";

/** Get the Deferred status from $ if we have jQuery, otherwise use Backbone's
 *  @returns {boolean} - Whether the request was deferred
 */
function getDeferred() {
	if ( Backbone.$ ) {
		return result( Backbone.$, 'Deferred', false );
	}
	return result( Backbone, 'Deferred', false );
}

/**
 * Sets up a Backbone Model to use the WP REST API
 */
class PersistentDataModel extends Backbone.Model {

	sync( method, model, options ) {
		let ElectronSettings = require( 'electron-settings' );

		console.log( arguments );
		let resp, errorMessage;
		const syncDfd = getDeferred();
		let key = this.getKey( model );
		let data = model.attributes;

		console.log( ElectronSettings.getAll() );
		console.log( key );
		// console.log('attributes', data );
		// console.log('toJSON', model.toJSON() );
		try {
			switch ( method ) {
				case 'read':
					resp = isUndefined( model.id ) ? ElectronSettings.getAll() : ElectronSettings.get( key, data );
					break;
				case 'create':
				case 'patch':
				case 'update':
					console.log(ElectronSettings);
					console.log( 'setting: ' + key, data );
					resp = ElectronSettings.set( key, data );
					break;
				case 'delete':
					console.log( ElectronSettings.getAll() );
					console.log( ElectronSettings.get( key ) );
					resp = ElectronSettings.delete( key );
					console.log( ElectronSettings.get( key ) );
					break;
			}

		} catch ( error ) {
			errorMessage = error.message;
		}
		console.log( resp );
		if ( resp ) {
			if ( options.success ) {
				options.success.call( model, resp, options );
			}
			if ( syncDfd ) {
				syncDfd.resolve( resp );
			}

		} else {
			errorMessage = errorMessage ? errorMessage : 'Record Not Found';

			if ( options.error ) {
				options.error.call( model, errorMessage, options );
			}
			if ( syncDfd ) {
				syncDfd.reject( errorMessage );
			}
		}

		// add compatibility with $.ajax
		// always execute callback for success and error
		if ( options.complete ) {
			options.complete.call( model, resp );
		}
		ipcRenderer.send( 'electron-settings-change', resp );
		return syncDfd && syncDfd.promise();
	}

	getKey( model ) {
		if ( isUndefined( model.id ) ) {
			model.id = model.cid;

		}
		return model.constructor.name + '.' + model.id;
	}
}

module.exports = PersistentDataModel;