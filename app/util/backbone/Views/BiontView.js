const TemplateHelpers = require( '../TemplateHelpers' );

class BiontView extends Backbone.View {
	/**
	 * Make all BRViews use our own TemplateLoader
	 *
	 * @returns {*}
	 */
	get template() {
		return _.template( this.getTemplateFromDOM() )
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
	getTemplateFromDOM( tplOverride ) {

		let tpl;

		/**
		 * Try to find a given override first
		 */
		if ( tplOverride && (
				tpl = document.getElementById( tplOverride )
			) ) {
			return tpl.innerHTML;
		}

		/**
		 * Walk up the prototype chain to find matching templates
		 */
		let curObject = this;
		while ( curObject && curObject.constructor.name !== 'BiontView' ) {
			if ( tpl = document.getElementById( curObject.constructor.name ) ) {
				return tpl.innerHTML;
			}
			curObject = Object.getPrototypeOf( curObject );
		}

		console.error( 'Could not find template for View ' + this.constructor.name );
		return '<div class="tplError">MISSING TEMPLATE</div>';
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

module.exports = BiontView;