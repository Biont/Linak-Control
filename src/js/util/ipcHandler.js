import {ipcMain, ipcRenderer} from "electron";
const isRenderer = (
	process && process.type === 'renderer'
);

function subscriptionHandle( handle ) {
	return 'subscribe-' + handle;
}

class MainProcessHandler {
	constructor() {
		this.subscribers = {};
	}

	register( handle ) {
		if ( !this.subscribers[ handle ] ) {
			this.subscribers[ handle ] = [];
		}
		ipcMain.on( subscriptionHandle( handle ), ( event, args ) => {
			this.subscribers[ handle ].push( { sender: event.sender, reply: args.reply } );
		} );
	}

	trigger( handle, data ) {

		if ( !this.subscribers[ handle ] ) {
			return;
		}
		this.subscribers[ handle ].forEach( ( element, index, array ) => {
			element.sender.send( element.reply, data );
		} );
	}

	unregister( handle ) {
		delete this.subscribers[ handle ];
	}

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

function getReply( handle ) {
	return handle + '_reply_' + guid();
}

function guid() {
	return Math.random().toString( 36 ).substring( 2, 15 ) +
		Math.random().toString( 36 ).substring( 2, 15 );
}

class RendererProcessHandler {
	subscribe( handle, callback ) {
		let reply = getReply();
		ipcRenderer.send( subscriptionHandle( handle ), { reply } );
		ipcRenderer.on( reply, ( event, data ) => {
			callback( event, data );
		} );
	}

	emit( handle, data, callback ) {
		let reply = getReply();

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
