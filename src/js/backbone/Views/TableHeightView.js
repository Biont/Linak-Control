import {debounce, extend} from "underscore";
import {ipcRenderer, remote} from "electron";
import {Renderer as background} from "../../util/ipcHandler";
import {BiontView} from "biont-backbone";

/**
 * Displays the table height and allows manual control
 */
export default class TableHeightView extends BiontView.extend( {
	formatters: {
		height      : ( value, instance ) => instance.formatSignalToCm( value ),
		targetHeight: ( value, instance ) => instance.formatSignalToCm( value )
	}
} ) {
	constructor( data, options ) {
		super( data, options );
		this.settings = data.settings;
		this.model = new Backbone.Model( {
			height      : 0,
			targetHeight: 0,
			min         : 0,
			max         : this.settings.get( 'maxHeight' )
		} );
		this.listenToTableHeight();

		/**
		 * Stop/resume work when the window is hidden/shown
		 */
		this.capture( 'windowHidden', () => {
			this.stopListeningToTableHeight()
		} );
		this.capture( 'windowShown', () => {
			this.listenToTableHeight();
		} );
	}

	/**
	 * Attach event listeners and set model data.
	 *
	 * @returns {*}
	 */
	listenToTableHeight() {

		return this.subscription = background.subscribe( 'table-height', ( event, data ) => {
			if ( data.signal && data.cm ) {
				if ( this.model.get( 'height' ) !== data.signal ) {
					this.model.set( 'height', data.signal );
				}
			}

		} );

	}

	/**
	 * Detach event listeners
	 */
	stopListeningToTableHeight() {
		if ( this.subscription ) {
			background.unsubscribe( 'table-height', this.subscription );
		}
	}

	/**
	 * Kill this view.
	 */
	remove() {
		this.stopListeningToTableHeight();
		super.remove();
	}

	/**
	 * Render the Table height widget.
	 *
	 * @param force
	 */
	render( force = false ) {
		let rendered = this.rendered;
		super.render( force );
		if ( !rendered || force ) {

			$( '[data-output]', this.$el ).knob();
			$( '[data-input]', this.$el ).knob(
				{
					change : ( value ) => {
						this.model.set( 'targetHeight', value );
					},
					release: debounce( ( value ) => {
						ipcRenderer.send( 'move-table', { height: value } );
					}, 666 )
				}
			).children().off( 'mousewheel DOMMouseScroll' ); // Prevent scroll events on input!!!

		}
	}

	/**
	 * Format the driver height value to a nice cm value.
	 *
	 * @param value
	 * @returns {string}
	 */
	formatSignalToCm( value ) {
		return (
			value / 98.0 + parseFloat( this.settings.get( 'heightOffset' ) )
			).toFixed( 1 ) + 'cm'
	}
}