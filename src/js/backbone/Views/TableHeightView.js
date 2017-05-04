import {extend} from "underscore";
import {Renderer as background} from "../../util/ipcHandler";
import BiontView from "./BiontView";
import ProgressBar from "progressbar.js";

/**
 * Does nothing but display a text message
 */
export default class TableHeightView extends BiontView.extend( {} ) {
	constructor( data, options ) {
		super( data, options );
		this.settings = data.settings;
		this.bar = false;
		this.curHeight = 0;
		this.tableData = { signal: '0', cm: '0', raw: 'Listening....' };

		this.listenToTableHeight();

		this.capture( 'windowHidden', () => {
			console.log('table height off')
			this.stopListeningToTableHeight()
		} );
		this.capture( 'windowShown', () => {
			console.log('table height on')
			this.listenToTableHeight()
		} );
	}

	listenToTableHeight() {

		return this.subscription =  background.subscribe( 'table-height', ( event, data ) => {
			if ( data.signal && data.cm ) {
				if ( this.curHeight !== data.signal ) {
					this.curHeight = data.signal;
					this.render();
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
		super.render( force );
		if ( !this.bar || force ) {
			let bar = new ProgressBar.SemiCircle( $( '#progress', this.$el )[ 0 ], {
				strokeWidth: 6,
				color      : '#1a237e',
				trailColor : '#eee',
				trailWidth : 1,
				easing     : 'linear',
				duration   : 500,
				svgStyle   : null,
				text       : {
					value        : '',
					alignToBottom: false
				},
				from       : { color: '#9fa8da', width: 1 },
				to         : { color: '#1a237e', width: 6 },
				// Set default step function for all animate calls
				step       : ( state, bar ) => {
					bar.path.setAttribute( 'stroke', state.color );
					bar.path.setAttribute( 'stroke-width', state.width );
					bar.setText( this.formatHeight( this.curHeight ) );

					bar.text.style.color = state.color;
				}
			} );
			bar.text.style.fontFamily = '"Roboto", Helvetica, sans-serif';
			bar.text.style.fontSize = '2rem';

			bar.animate( this.getClamped() );  // Number from 0.0 to 1.0
			this.bar = bar;
		} else {
			this.bar.animate( this.getClamped() );

		}
	}

	getTemplateData() {
		let data = super.getTemplateData();
		extend( data, { height: this.formatHeight( this.tableData.signal ) } );
		return data;
	}

	formatHeight( value ) {
		return (
				value / 98.0 + parseFloat( this.settings.get( 'heightOffset' ) )
			).toFixed( 2 ) + 'cm'
	}

	getClamped() {
		return this.curHeight / parseFloat( this.settings.get( 'maxHeight' ) ).toFixed();
	}

}