import {ipcRenderer, remote} from "electron";
import {BiontView} from "biont-backbone";
import TimePickerView from "./TimePickerView";
export default class ScheduleFormView extends BiontView.extend( {
	events  : {
		'click [data-action="test"]': 'onTestBtn',
	},
	subViews: {
		timepicker: ( _this ) => new TimePickerView( {
			model: _this.model
		} )
	}
} ) {
	constructor( data, options ) {
		super( data, options );
	}

	onTestBtn() {
		ipcRenderer.send( 'move-table', { height: this.model.get( 'height' ) } );

	}
}
