import BiontView from "./BiontView";

/**
 * Does nothing but display a text message
 */
export default class SearchDeviceView extends BiontView.extend( {} ) {
	constructor( data, options ) {
		super( data, options );
		this.text = data.text || '';
	}

	/**
	 * Very basic render function.
	 * @returns {TimePickerView}
	 */
	render() {
		super.render( { text: this.text } );
	}

}