import {ipcRenderer, remote} from "electron";
import BiontView from "./BiontView";

/**
 * Does nothing but display a text message
 */
export default class TableHeightView extends BiontView.extend( {} ) {
	constructor( data, options ) {
		super( data, options );
		this.tableData = { signal: '0', cm: '0', raw: 'Listening....' };

		this.listenToTableHeight();
	}

	/**
	 * Very basic render function.
	 * @returns {TableHeightView}
	 */
	render() {
		super.render( this.tableData );
	}

	listenToTableHeight() {
		let reply = 'app-notify';
		ipcRenderer.send( 'subscribe-notifications', { reply } );
		ipcRenderer.on( reply, ( event, data ) => {
			this.tableData = data;
			this.render();
		} );

	}

}