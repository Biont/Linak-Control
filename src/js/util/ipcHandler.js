import {ipcMain, ipcRenderer} from "electron";
const isRenderer = (
	process && process.type === 'renderer'
);

function subscriptionHandle( handle ) {
	return 'subscribe-' + handle;
}

function unsubscribeHandle( handle ) {
	return 'unsubscribe-' + handle;
}

function getReply( handle ) {
	return handle + '_reply_' + guid();
}

function guid() {
	return Math.random().toString( 36 ).substring( 2, 15 ) +
		Math.random().toString( 36 ).substring( 2, 15 );
}

class MainProcessHandler {
	constructor() {
		this.subscribers = {};
	}

	/**
	 * Provides an endpoint for renderer code to subscribe to
	 *
	 * @param handle
	 */
	register( handle ) {
		/**
		 * Make sure there's an array to push to
		 */
		if ( !this.subscribers[ handle ] ) {
			this.subscribers[ handle ] = [];
		}
		/**
		 * Listen to new subscriptions and push them to our subscribers
		 */
		ipcMain.on( subscriptionHandle( handle ), ( event, args ) => {
			this.subscribers[ handle ].push( { sender: event.sender, reply: args.reply } );
		} );
		/**
		 * Listen to unsubscribe requests and kill the matching subscription
		 */
		ipcMain.on( unsubscribeHandle( handle ), ( event, args ) => {
			this.subscribers[ handle ].forEach( ( element, index, array ) => {
				if ( element.reply = args.reply ) {
					delete this.subscribers[ handle ][ index ];
				}
			} );
		} );
	}

	/**
	 * Send an event to all subscribers
	 *
	 * @param handle
	 * @param data
	 */
	trigger( handle, data ) {

		if ( !this.subscribers[ handle ] ) {
			return;
		}
		this.subscribers[ handle ].forEach( ( element, index, array ) => {
			if ( element.sender.isDestroyed() ) {
				return;
			}
			element.sender.send( element.reply, data );
		} );
	}

	/**
	 * Remove an entire endpoint
	 *
	 * @param handle
	 */
	unregister( handle ) {
		delete this.subscribers[ handle ];
	}

	/**
	 * Listen to events from renderers
	 *
	 * @param handle
	 * @param eventCallback
	 * @param dataCallback
	 */
	on( handle, eventCallback, dataCallback ) {
		ipcMain.on( handle, ( event, args ) => {
			let data = args.data || {};

			eventCallback( data );

			if ( dataCallback ) {
				dataCallback( data );
			}
			event.sender.send( args.reply, data );
		} );
	}

}

class RendererProcessHandler {
	/**
	 * Subscribe to a specified endpoint
	 *
	 * @param handle
	 * @param callback
	 * @returns {*}
	 */
	subscribe( handle, callback ) {
		let reply = getReply( handle );
		ipcRenderer.send( subscriptionHandle( handle ), { reply } );
		ipcRenderer.on( reply, ( event, data ) => {
			callback( event, data );
		} );
		return reply;
	}

	/**
	 * Unsubscribe from the specified endpoint.
	 *
	 * @param handle
	 * @param reply
	 */
	unsubscribe( handle, reply ) {
		ipcRenderer.send( unsubscribeHandle( handle ), { reply } );
	}

	/**
	 * Send an event to the background.
	 *
	 * @param handle
	 * @param data
	 * @param callback
	 */
	emit( handle, data, callback ) {
		let reply = getReply( handle );

		ipcRenderer.send( handle, { data, reply } );
		if ( !callback ) {
			return;
		}
		ipcRenderer.once( reply, ( event, data ) => {
			callback( event, data );
		} );
	}

}

let exports = {};
if ( isRenderer ) {
	exports.Renderer = new RendererProcessHandler();
} else {
	exports.Main = new MainProcessHandler();
}

module.exports = exports;
