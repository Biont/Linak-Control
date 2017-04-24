import BiontView from "./BiontView.js";
import TimePickerView from "./TimePickerView";
export default class ScheduleFormView extends BiontView.extend() {
	constructor( data, options ) {
		super( data, options );
		this.timePicker = new TimePickerView( {
			model: data.model
		} );

	}

	render() {
		super.render();
		this.assign( this.timePicker, '[data-timepicker]' );
		return this;
	}
}
