const BiontView = require( './BiontView.js' );
const ListView = require( './ListView.js' );
const TemplateHelpers = require( '../TemplateHelpers' );

module.exports = class AppView extends BiontView {
	events() {
		return {
			"click [data-add]": "open",
		};
	}

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