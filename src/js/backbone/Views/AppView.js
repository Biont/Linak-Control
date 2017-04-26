import BiontView from "./BiontView.js";
import ModalView from "./ModalView";
import ScheduleFormView from "./ScheduleFormView";

import ListView from "./ListView.js";
import ScheduleItemView from "./ScheduleItemView.js";
import ScheduleItem from "../Models/ScheduleItem.js";

export default class AppView extends BiontView.extend( {
	events: {
		"click [data-add]"       : "open",
		"click [data-delete-all]": "deleteAll",
	}
} ) {

	constructor( data, options ) {
		data.subViews = data.subViews || {
				schedule: new ListView( {
					view      : ScheduleItemView,
					collection: data.collection
				} )
			};
		super( data, options );
		this.collection = data.collection;

		this.listenTo( this.collection, 'empty', this.open );
	}

	open() {
		let time = (
			new Date()
		).toLocaleTimeString( [], { hour: '2-digit', minute: '2-digit' } );
		let newItem = new ScheduleItem( {
			time
		} );
		let modal = new ModalView( {
				closeBtnText: 'Save',
				subViews    : {
					content: new ScheduleFormView( {
						model: newItem
					} )

				}
			}
		);

		modal.render();
		this.listenTo( modal, 'remove:button', function() {
			newItem.save();
			this.collection.fetch();
		} );
	}

	deleteAll() {
		const store = require( 'electron-settings' );
		store.deleteAll();
		this.collection.fetch();
	}

};