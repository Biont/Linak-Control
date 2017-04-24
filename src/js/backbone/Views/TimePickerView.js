import Backbone from "backbone";

/**
 * Does nothing but display a text message
 */
export default class TimePickerView extends Backbone.View {
	constructor( data, options ) {
		super( data, options );
		// this.text = data.text;
	}

	/**
	 * Very basic render function.
	 * @returns {TextModalView}
	 */
	render() {
		let time = '14:20:00';
		this.$el.html( '<input id="timepicker_' + this.cid + '" value="' + time + '" class="timepicker" type="time">' );
		$( '#timepicker_' + this.cid ).pickatime( {
			autoclose : false,
			twelvehour: false,
			default   : time
		} );
		return this;
	}

}