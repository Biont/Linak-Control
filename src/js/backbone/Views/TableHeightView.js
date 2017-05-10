import {debounce, extend} from "underscore";
import {ipcRenderer, remote} from "electron";
import {Renderer as background} from "../../util/ipcHandler";
import {BiontView} from "biont-backbone";

/**
 * Does nothing but display a text message
 */
export default class TableHeightView extends BiontView.extend( {
	formatters: {
		height: ( value, instance ) => Math.round( value / 98.0 + parseFloat( instance.settings.get( 'heightOffset' ) ) ).toFixed( 1 ) + 'cm'
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

		this.capture( 'windowHidden', () => {
			console.log( 'table height off' )
			this.stopListeningToTableHeight()
		} );
		this.capture( 'windowShown', () => {
			console.log( 'table height on' )
			this.listenToTableHeight()
		} );
	}

	listenToTableHeight() {

		return this.subscription = background.subscribe( 'table-height', ( event, data ) => {
			if ( data.signal && data.cm ) {
				if ( this.model.get( 'height' ) !== data.signal ) {
					this.model.set( 'height', data.signal );
				}
			}

		} );

	}

	stopListeningToTableHeight() {
		if ( this.subscription ) {
			background.unsubscribe( 'table-height', this.subscription );
		}
	}

	remove() {
		this.stopListeningToTableHeight();
		super.remove();
	}

	render( force = false ) {
		let rendered = this.rendered;
		super.render( force );
		if ( !rendered || force ) {
console.log(window.$.knob);
			window.$( '[data-output]', this.$el ).knob();
			window.$( '[data-input]', this.$el ).knob(
				{
					release: debounce( ( value ) => {
						this.model.set( 'targetHeight', value );
						ipcRenderer.send( 'move-table', { height: value } );
					}, 666 )
				}
			);
		}
	}
}