import ListView from "./ListView";

export default class LinakListView extends ListView.extend( {} ) {
	constructor( data, options ) {
		super( data, options );

		this.settings = data.settings;
	}

	getItemData( item ) {
		let data = super.getItemData( item );
		data.settings = this.settings;
		return data;
	}
};