import {ListView} from "biont-backbone";

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

	render() {
		super.render();
		this.$el.collapsible( {
			accordion: false
		} );
		Materialize.updateTextFields();
	}
};