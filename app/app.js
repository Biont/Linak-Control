const Linak = require( './util/linakUtil.js' );

class App {
	/**
	 * Configure the sudo prompt
	 */
	constructor() {
	}

	init() {
		let linak = new Linak();
		linak.moveTo( 60 );
	}

}
module.exports = App;
