import {ipcRenderer, remote} from "electron";
import BiontModel from "./BiontModel";
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
class PersistentDataModel extends BiontModel {

	sync( method, model, options ) {
		const syncDfd = getDeferred();

		let key = this.getKey();
		let data = model.toJSON();
		ipcRenderer.send( 'electron-settings-change', { method, key, data, replyContext: this.getReplyContext() } );

		// add compatibility with $.ajax
		// always execute callback for success and error
		ipcRenderer.once( this.getReplyContext(), ( event, result ) => {
			if ( result ) {
				syncDfd.resolve();

				if ( options.success ) {
					options.success.call( model, result, options );
				}
				if ( options.complete ) {

					options.complete.call( model, result );
				}
			} else {
				let errorMessage = 'Record Not Found';

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

	getKey() {
		if ( isUndefined( this.id ) ) {
			this.id = this.cid;

		}
		return this.constructor.name + '.' + this.id;
	}

	getReplyContext() {
		return 'asyncSettingsReply:' + this.constructor.name;
	}
}

module.exports = PersistentDataModel;