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
 * Created by biont on 21.04.17.
 */
export default class PersistentDataCollection extends Backbone.Collection {
	get url() {
		let url = this.endpoint;
		if ( this.requestParams !== undefined ) {
			url += '/?' + this.requestParams;
		}
		return url;
	}

	constructor( args, options ) {
		super( args, options );
		this.model = args.model || Backbone.Model;
		this.endpoint = args.endpoint;
		if ( args.requestParams ) {
			this.requestParams = args.requestParams;

		}
		this.nonces = args.nonces;
		console.log( this.url );
	}

	sync( method, model, options ) {
		const store = require( 'electron-settings' );
		let resp, errorMessage;
		const syncDfd = getDeferred();

		try {
			switch ( method ) {
				case 'read':
					resp = isUndefined( model.id ) ? store.get( this.model.name ) : store.get( model.constructor.name + '.' + model.cid );
					break;
				case 'create':
				case 'patch':
				case 'update':
					resp = store.set( model );
					break;
				case 'delete':
					resp = store.delete( model );
					break;
			}

		} catch ( error ) {
			errorMessage = error.message;
		}

		resp = $.map( resp, function( value, index ) {
			value.id = index;
			return [ value ];
		} );
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

		return syncDfd && syncDfd.promise();
	}

	fetch() {
		super.fetch(
			{
				add    : true,
				remove : true,
				merge  : true,
				data   : this.queryArgs,
				success: function() {
					console.log( 'fetch', arguments );
				}
			}
		);
	}
}