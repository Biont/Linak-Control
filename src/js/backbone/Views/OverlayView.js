import {BiontView} from "biont-backbone";
import TextView from "./TextView";

/**
 * Creates a fullscreen popup box with custom content
 * Non-interactive and cannot be closed manually. Use a ModalView for that.
 */
export default class OverlayView extends BiontView.extend( {
	subViews: {
		content: () => new TextView( {
			text: 'Overlay'
		} )

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

		this.header = data.header || false;

		jQuery( 'body' ).append( this.$el );

		if ( data.autoClose !== undefined ) {
			setTimeout( () => this.remove(), data.autoClose );
		}
	}

	remove() {
		jQuery( '.biont-modal-content', this.$el ).removeClass( 'scale-in' );
		setTimeout( () => {
			this.trigger( 'remove', this );
			super.remove();
		}, 350 );
	}

	/**
	 * Render the alert box
	 *
	 * @returns {ModalView}
	 */
	render() {
		let data = {
			header: this.header,
		};
		this.$el.html( this.template( data ) );
		this.autoSubView();
		setTimeout( () => jQuery( '.biont-modal-content', this.$el ).addClass( 'scale-in' ), 100 );

		return this;
	}

}