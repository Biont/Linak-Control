import {ipcRenderer, remote} from "electron";
import BiontView from "./BiontView.js";
import TimePickerView from "./TimePickerView";
export default class ScheduleFormView extends BiontView.extend( {
	events: {
		'click [data-action="test"]': 'onTestBtn',
	}
} ) {
	constructor( data, options ) {
		/**
		 * Setup default subViews
		 * @type {{form: ScheduleFormView}}
		 */
		data.subViews = data.subViews || {
				timepicker: new TimePickerView( {
					model: data.model
				} )
			};
		super( data, options );
	}

	onTestBtn() {
		ipcRenderer.send( 'move-table', { height: this.model.get( 'height' ) } );

	}
}
