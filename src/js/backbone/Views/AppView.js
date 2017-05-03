import {Renderer as background} from "../../util/ipcHandler";

import BiontView from "./BiontView.js";
import ConfirmView from "./ConfirmView";
import OverlayView from "./OverlayView";
import ModalView from "./ModalView";
import AppSettingsView from "./AppSettingsView";
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
		"click [data-action]"    : "onClickAction",
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
		this.showingAlert = false;
		background.subscribe( 'deviceFound', () => this.onDeviceFound() );
		background.subscribe( 'deviceLost', () => this.onDeviceLost() );
		background.subscribe( 'alert', ( event, alert ) => this.onNotification( alert ) );

		//Debug
		// this.devShim();

		this.listenTo( this.collection, 'empty', this.open );

		background.emit( 'rendererReady' );
	}

	onClickAction( e ) {
		e.preventDefault();
		e.stopImmediatePropagation();
		let action = jQuery( e.currentTarget ).data( 'action' );
		switch ( action ) {
			case'settings':
				this.openSettings();
				break;
			case'remove':
				this.model.destroy();
		}
	}

	openSettings() {
		let modal = new ModalView( {
				header      : 'Settings',
				closeBtnText: 'Save',
				subViews    : {
					content: () => new AppSettingsView()

				}
			}
		);

		modal.render();
		this.listenTo( modal, 'remove:button', function() {
			this.render( true )
		} );
	}

	devShim() {
		let that = this;
		let delay = 4000;

		function lost() {
			that.onDeviceLost();
			setTimeout( () => {
				found();
			}, delay );
		}

		function found() {
			that.onDeviceFound();

			setTimeout( () => {
				lost()
			}, delay );
		}

		setTimeout( () => {
			found();
		}, delay );
	}

	onDeviceFound() {
		console.log( 'device found' );
		this.deviceFound = true;
		if ( this.searchModal ) {
			this.searchModal.remove();
			delete this.searchModal;
		}
		this.render()
	}

	onDeviceLost() {
		console.log( 'device lost' );
		this.deviceFound = false;
		this.render()
	}

	render( force = false ) {
		// super.render();return;
		if ( !this.deviceFound ) {
			if ( !this.searchModal ) {
				this.openSearchModal();
			}
		} else {
			super.render( force );
		}
	}

	onNotification( alert ) {
		console.log( 'receiving alert' );
		if ( this.showingAlert ) {
			return;
		}
		console.error( alert );
		let modal = new ModalView( {
			header  : alert.title,
			subViews: {
				content: () => new TextView( {
					text: alert.message
				} )

			}
		} );
		modal.render();
		this.showingAlert = true;
		this.listenTo( modal, 'remove:button', function() {
			this.showingAlert = false;

		} );
	}

	openSearchModal() {
		this.searchModal = new OverlayView( {
				header      : 'Waiting for Device...',
				closeBtnText: 'Save',
				subViews    : {
					content: () => new SearchDeviceView( {
						text: 'The USB driver could not find the device. Please connect the USB2LIN06 cable with your computer'
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