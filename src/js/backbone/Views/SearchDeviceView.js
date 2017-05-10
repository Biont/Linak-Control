import {BiontView} from "biont-backbone";

/**
 * Does nothing but display a text message
 */
export default class SearchDeviceView extends BiontView.extend( {} ) {
	constructor( data, options ) {
		super( data, options );
		this.text = data.text || '';
	}

	getTemplateData() {
		let data = super.getTemplateData();
		data.text = this.text;
		return data;
	}

}