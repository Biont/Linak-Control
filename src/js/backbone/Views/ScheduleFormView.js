import BiontView from "./BiontView.js";
import TimePickerView from "./TimePickerView";
export default class ScheduleFormView extends BiontView.extend() {
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
}
