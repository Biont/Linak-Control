import {extend} from "underscore";
import {Renderer as background} from "../../util/ipcHandler";
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

	listenToTableHeight() {

		background.subscribe( 'table-height', ( event, data ) => {
			if ( data.signal && data.cm ) {
				this.tableData = data;
				this.render( true );
			}

		} );

	}

	getTemplateData() {
		let data = super.getTemplateData();
		extend( data, this.tableData );
		return data;
	}

}