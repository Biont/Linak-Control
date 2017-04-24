import BiontView from "./BiontView";
/**
 * Creates a fullscreen popup box with custom content
 */
export default class ModalView extends BiontView.extend( {
	events: {
		'click .biont-modal-close': 'remove',
	}
} ) {
	/**
	 * Setup the editor-specific events and arguments
	 *
	 * @param data
	 * @param options
	 */
	constructor( data, options ) {
		super( data, options );

		this.closeBtnText = data.closeBtnText || 'OK';
		this.content = data.content;

		jQuery( 'body' ).append( this.$el );

		if ( data.autoClose !== undefined ) {
			setTimeout( () => this.remove(), data.autoClose );
		}
		jQuery( document ).keyup( this.keyAction.bind( this ) );
	}

	keyAction( e ) {
		let code = e.keyCode || e.which;
		if ( code === 27 ) {
			this.remove();
		}
	}

	remove() {
		this.trigger( 'remove', this );
		super.remove();
	}

	/**
	 * Render the alert box
	 *
	 * @returns {ModalView}
	 */
	render() {
		let data = {
			closeBtnText: this.closeBtnText
		};
		this.$el.html( this.template( data ) );
		if ( this.content ) {
			this.assign( this.content, '[data-biont-modal-view]' );

		}
		jQuery( '.biont-modal-content', this.$el ).addClass( 'scale-in' );
		return this;
	}

}