import {Renderer as background} from "../../util/ipcHandler";

import BiontView from "./BiontView.js";
import ConfirmView from "./ConfirmView";
import OverlayView from "./OverlayView";
import ModalView from "./ModalView";
import ScheduleFormView from "./ScheduleFormView";
import TableHeightView from "./TableHeightView";
import TableStatisticsView from "./TableStatisticsView";
import SearchDeviceView from "./SearchDeviceView";
import TextView from "./TextView";
import ListView from "./ListView.js";
import ScheduleItemView from "./ScheduleItemView.js";
import ScheduleItem from "../Models/ScheduleItem.js";

export default class AppView extends BiontView.extend( {
	events     : {
		"click [data-add]"       : "open",
		"click [data-delete-all]": "deleteAll",
	}, subViews: {
		schedule       : ( _this ) => new ListView( {
			view      : ScheduleItemView,
			collection: _this.collection
		} ),
		tableHeight    : () => new TableHeightView(),
		tableStatistics: () => new TableStatisticsView()
	}
} ) {

	constructor( data, options ) {

		super( data, options );
		this.collection = data.collection;
		this.deviceFound = false;
		background.subscribe( 'deviceFound', () => {
			console.log( 'device found' );
			this.deviceFound = true;
			if ( this.searchModal ) {
				this.searchModal.remove();
				delete this.searchModal;
			}
			this.render()

		} );
		background.subscribe( 'deviceLost', () => {
			console.log( 'device lost' );
			this.deviceFound = false;
			this.render()
		} );

		this.listenTo( this.collection, 'empty', this.open );

		background.emit( 'rendererReady' );
	}

	render() {
		if ( !this.deviceFound ) {
			console.log( 'searchmodal', this.searchModal );
			if ( !this.searchModal ) {
				this.openSearchModal();
			}
		} else {
			super.render();
		}
	}

	openSearchModal() {
		this.searchModal = new OverlayView( {
				header      : 'Waing for Device...',
				closeBtnText: 'Save',
				subViews    : {
					content: () => new SearchDeviceView( {
						text: 'Looking for Device'
					} )

				}
			}
		);
		this.searchModal.render();
	}

	open() {
		let time = (
			new Date()
		).toLocaleTimeString( [], { hour: '2-digit', minute: '2-digit' } ), height = 80;

		let newItem = new ScheduleItem( {
			time, height
		} );
		let modal = new ModalView( {
				header      : 'Create new Schedule Item',
				closeBtnText: 'Save',
				subViews    : {
					content: () => new ScheduleFormView( {
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

		let confirm = new ConfirmView( {
				header  : 'Are you sure?',
				subViews: {
					content: new TextView( {
						text: 'This will wipe ALL application data. Are you sure?'
					} )

				},
				confirm : () => {
					console.log( 'DELETING EVERYTHING!!' );
					return;
					const store = require( 'electron-settings' );
					store.deleteAll();
					this.collection.fetch();

				}
			}
		);

		confirm.render();

	}

};