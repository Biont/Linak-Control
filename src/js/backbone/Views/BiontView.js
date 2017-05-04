import Backbone from "backbone";
import {each, extend, mapObject} from "underscore";

import fs from "fs";
import TemplateHelpers from "../TemplateHelpers";
const tplDir = '../../tpl/';

export default class BiontView extends Backbone.View.extend( {
	subViews  : {},
	formatters: {}
} ) {
	/**
	 * Make all BiontViews use our own TemplateLoader
	 *
	 * @returns {*}
	 */
	get template() {
		return this.getTemplate()
	}

	constructor( data = {}, options = {} ) {
		super( data, options );
		if ( data.subViews ) {
			this.subViews = data.subViews;
		}
		this.subViewInstances = {};
		if ( data.formatters ) {
			this.formatters = data.formatters;
		}
		this.parent = null;
		// this.subViews = data.subViews;
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
		tplOverride = __dirname + '/' + tplDir + tplOverride + '.js';

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
			let tplModule = __dirname + '/' + tplDir + curObject.constructor.name + '.js';
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
	render( force = false ) {

		if ( !this.rendered || force ) {
			this.$el.html( this.template( this.getTemplateData() ) );
			this.autoBind();
			this.rendered = true;
		}
		this.autoSubView( force );

		return this;
	}

	/**
	 * Gathers all data that is passed on to the template.
	 *
	 * Can be overloaded by subclasses to add custom data.
	 *
	 * @returns {{}}
	 */
	getTemplateData() {
		let data = this.model ? this.model.toJSON() : {};
		data = this.formatData( data );

		extend( data, TemplateHelpers );
		return data;
	}

	/**
	 * Apply configured subviews to their matching template tags.
	 *
	 * Example:
	 * // View
	 * class Foo extends BiontView.extend({
	 *
	 *     subViews: { myView: () => new BarView() }
	 *
	 * }){}
	 *
	 * // Template
	 * <div cata-subview="myView"></div>
	 *
	 *
	 * @param forced
	 */
	autoSubView( forced ) {
		$( '[data-subview]', this.$el ).each( ( idx, obj ) => {
			let $this = $( obj ), data = $this.data();
			if ( !data.subview ) {
				console.error( 'empty subview attribute' );
				return;
			}

			if ( !this.subViews.hasOwnProperty( data.subview ) ) {
				return;
			}
			if ( data.subviewparent && data.subviewparent !== this.cid ) {
				console.log( 'no want' );

				return;
			}

			let view = this.subViews[ data.subview ];
			let instance = this.subViewInstances[ data.subview ];
			if ( instance && instance instanceof Backbone.View ) {
				if ( !forced ) {
					instance.render();
					return;
				}
				instance.remove();
				delete this.subViewInstances[ data.subview ];

			}
			if ( typeof view === 'function' ) {
				// Support traditional and arrow functions to some extent
				view = view.call( this, this );
				view.parent = this;
				view.setElement( $this ).render( forced );
				$this.data( 'subviewparent', this.cid );
				this.subViewInstances[ data.subview ] = view;
			}

		} );
	}

	/**
	 * Binds model data to template tags
	 *
	 * Example:
	 *
	 * <div data-bind="name"></div> // This will keep the current value of "name" inside the container's html
	 *
	 * <input type='text' data-bind="name"> // This will instead set the input's value
	 *
	 */
	autoBind() {
		if ( !this.model ) {
			return;
		}
		$( '[data-bind]', this.$el ).each( ( idx, obj ) => {
			let $this = $( obj ), data = $this.data();
			if ( !data.bind ) {
				console.error( 'empty tag' );
				return;
			}
			switch ( $this.prop( 'tagName' ) ) {
				case 'INPUT':
					this.bindInput( $this, data.bind );
					break;
				default:
					this.bindDefault( $this, data.bind );
					break;

			}
		} );
	}

	formatData( data ) {

		each( data, ( value, attr ) => {
			data[ attr ] = this.formatAttr( attr, value )
		} );
		return data;
	}

	formatAttr( attr, data ) {

		if ( !this.formatters[ attr ] ) {
			return data;
		}
		return this.formatters[ attr ].call( this, data, this );
	}

	bindDefault( $element, attr ) {
		$element.html( this.formatAttr( attr, this.model.get( attr ) ) );
		this.listenTo( this.model, 'change', ( model ) => $element.html( this.formatAttr( attr, model.get( attr ) ) ) );
	}

	bindInput( $element, attr ) {
		console.log( 'binding...', $element.attr( 'type' ) )
		switch ( $element.attr( 'type' ) ) {
			case 'checkbox':
				//TODO: allow setting up a [data-falsevalue="foo"] for non-boolean values?
				$element.change( () => this.model.set( attr, $element.prop( 'checked' ) ) );
				this.listenTo( this.model, 'change', ( model ) => {
					$element.prop( 'checked', (
						model.get( attr )
					) );
				} );
				$element.prop( 'checked', (
					this.model.get( attr )
				) );
				break;
			default:
				$element.change( () => this.model.set( attr, $element.val() ) );
				this.listenTo( this.model, 'change', ( model ) => $element.val( model.get( attr ) ) );
				$element.val( this.model.get( attr ) );
				break;
		}
	}

	dump() {
		console.log( this.model );
		return JSON.stringify( this.getTemplateData() );
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

	remove() {
		this.undelegateEvents();
		super.remove();
	}

}
