import Backbone from "backbone";

import fs from "fs";
import ejs from "ejs";
import TemplateHelpers from "../TemplateHelpers";
const tplDir = '../../tpl/';

require.extensions[ '.ejs' ] = function( module ) {
	let filename = module.filename;
	let options = { filename: filename, client: true, compileDebug: true };
	let template = fs.readFileSync( filename ).toString().replace( /^\uFEFF/, '' );
	let fn = ejs.compile( template, options );
	return module._compile( 'module.exports = ' + fn.toString() + ';', filename );
};

export default class BiontView extends Backbone.View.extend( {} ) {
	/**
	 * Make all BRViews use our own TemplateLoader
	 *
	 * @returns {*}
	 */
	get template() {
		return this.getTemplate()
	}

	constructor( data, options ) {
		super( data, options );
		if ( this.constructor.name === 'BiontView' ) {
			throw new TypeError( "Cannot construct BiontView instances directly" );
		}
	}

	/**
	 * Retrieves a template from the DOM
	 *
	 * @param tplOverride
	 * @returns {string}
	 */
	getTemplate( tplOverride ) {

		let tpl;

		/**
		 * Try to find a given override first
		 */
		tplOverride = __dirname + '/' + tplDir + tplOverride + '.ejs';

		if ( tplOverride && (
				fs.existsSync( tplOverride )
			) ) {
			return require( tplOverride );
		}

		/**
		 * Walk up the prototype chain to find matching templates
		 */
		let curObject = this;
		while ( curObject && curObject.constructor.name !== 'BiontView' ) {
			let tplModule = __dirname + '/' + tplDir + curObject.constructor.name + '.ejs';
			if ( fs.existsSync( tplModule ) ) {
				return require( tplModule );
			}
			curObject = Object.getPrototypeOf( curObject );
		}

		console.error( 'Could not find template for View ' + this.constructor.name );
		return function() {
			return '<div class="tplError">MISSING TEMPLATE</div>'
		};
	}

	/**
	 * Very basic render function.
	 * @returns {BiontView}
	 */
	render() {
		let data = this.model ? this.model.toJSON() : {};
		_.extend( data, TemplateHelpers );
		this.$el.html( this.template( data ) );
		return this;
	}

	/**
	 * Assigns a selector within the template to a specific subview, which will then get rendered
	 * @param view
	 * @param selector
	 */
	assign( view, selector ) {
		selector = selector || '[data-subview="' + view.constructor.name + '"]';

		let $el;

		if ( $el = this.$( selector, this.$el ) ) {
			view.setElement( $el ).render();

		}
	}

}
