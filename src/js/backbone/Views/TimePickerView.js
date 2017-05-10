import {BiontView} from "biont-backbone";

/**
 * Does nothing but display a text message
 */
export default class TimePickerView extends BiontView.extend( {} ) {
	constructor( data, options ) {
		super( data, options );
		// this.text = data.text;
	}

	/**
	 * Very basic render function.
	 * @returns {TimePickerView}
	 */
	render() {
		super.render();
		let time = this.model.get( 'time' ),
			args = {
				autoclose : false,
				twelvehour: false,
				default   : time
			};
		$('input[type="time"]',this.$el).pickatime( args );

		return this;
	}

}