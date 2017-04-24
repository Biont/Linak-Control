import BiontView from "./BiontView.js";
const ListView = require( './ListView.js' );
const TemplateHelpers = require( '../TemplateHelpers' );

export default class AppView extends BiontView.extend( {
	events: {
		"click [data-add]": "open",
	}
} ) {

	constructor( data, options ) {
		super( data, options );
		this.collection = data.collection;
	}

	open() {
		console.log( 'wooo' );

		this.collection.create( {} );
	}

	render() {
		super.render();
		// this.assign( ListView, '[data-schedule]' );
	}

};