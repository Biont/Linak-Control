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
 * Created by biont on 21.04.17.
 */
export default class PersistentDataCollection extends Backbone.Collection {

	constructor( args, options ) {
		super( args, options );
		this.model = args.model || Backbone.Model;
		this.comparator = args.comparator;
		this.endpoint = args.endpoint;
		if ( args.requestParams ) {
			this.requestParams = args.requestParams;

		}
	}

	sync( method, model, options ) {
		const syncDfd = getDeferred();
		console.log( arguments );

		let key = isUndefined( model.id ) ? this.model.name : model.constructor.name + '.' + model.cid;
		let data = model.toJSON();
		ipcRenderer.send( 'electron-settings-change', { method, key, data, replyContext: this.getReplyContext() } );

		// add compatibility with $.ajax
		// always execute callback for success and error
		ipcRenderer.once( this.getReplyContext(), ( event, result ) => {
			if ( result ) {
				console.log( result );
				console.log( model );
				/**
				 * When fetching the entire collection,
				 * we'll receive an array-like object which needs to be converted to a proper array
				 */
				if ( isUndefined( model.id ) ) {
					result = $.map( result, function( value, index ) {
						value.id = value.id || index;
						return [ value ];
					} );
				}
				console.log( 'got result', result );
				syncDfd.resolve();

				if ( options.success ) {
					options.success.call( model, result, options );
				}
				if ( options.complete ) {

					options.complete.call( model, result );
				}
			} else {
				errorMessage = 'Record Not Found';

				if ( options.error ) {
					options.error.call( model, errorMessage, options );
				}
				if ( syncDfd ) {
					syncDfd.reject( errorMessage );
				}
			}

		} );
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
		this.checkEmpty();
	}

	checkEmpty() {
		if ( this.isEmpty() ) {
			console.log( 'Collection is now empty' );
			this.trigger( 'empty', this )
		}
	}

	getReplyContext() {
		return 'asyncSettingsReply:' + this.constructor.name;
	}
}