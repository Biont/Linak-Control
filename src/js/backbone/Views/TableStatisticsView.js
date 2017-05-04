import {Renderer as background} from "../../util/ipcHandler";
import BiontView from "./BiontView";
import Chart from "chart.js";

/**
 * Does nothing but display a text message
 */
export default class TableHeightView extends BiontView.extend( {} ) {
	constructor( data, options ) {
		super( data, options );
		this.statistics = {};
		this.listenToTableStatistics();

		this.capture( 'windowHidden', () => {
			this.stopListeningToTableStatistics()
		} );
		this.capture( 'windowShown', () => {
			this.listenToTableStatistics()
		} );
	}

	/**
	 * Very basic render function.
	 * @returns {TableHeightView}
	 */
	render( force = false ) {
		if ( !this.chart || force ) {
			this.$el.html( '<canvas id="myChart" width="400" height="250"></canvas>' );
			this.chart = new Chart( $( '#myChart', this.$el ), {
				type   : 'line',
				data   : this.generateData(),
				options: {
					animation: false,
					scales   : {
						yAxes: [
							{
								ticks: {
									callback   : ( v ) => this.formatMsToMin( v ),
									beginAtZero: true
								}
							}
						],
						xAxes: [
							{
								ticks: {
									callback   : ( v ) => this.formatSignalToCm( v ),
									beginAtZero: true
								}
							}
						]
					},
					tooltips : {
						mode     : 'label',
						callbacks: {
							title: ( tooltipItem, data ) => this.formatSignalToCm( data.labels[ tooltipItem[ 0 ].index ] ) + ' (' + data.labels[ tooltipItem[ 0 ].index ] + ')',
							label: ( tooltipItem, data ) => this.formatMsToMin( data.datasets[ 0 ].data[ tooltipItem.index ] )
						}
					},
				}
			} );
		} else {
			this.chart.config.data = this.generateData();
			this.chart.update();
		}

		return this;
	}

	formatMsToMin( v ) {
		return Math.round( v / 1000 / 60 ) + ' min'
	}

	formatSignalToCm( v ) {
		return Math.round( v / 98.0 ).toFixed( 1 ) + ' cm'
	}

	listenToTableStatistics() {
		return this.subscription = background.subscribe( 'app-statistics', ( event, data ) => {
			this.statistics = data;
			this.render();
		} );

	}

	stopListeningToTableStatistics() {
		if ( this.subscription ) {
			background.unsubscribe( 'app-statistics', this.subscription );
		}
	}

	remove() {
		this.stopListeningToTableStatistics();
		super.remove();
	}

	generateData() {
		return {
			labels  : this.generateLabels(),
			datasets: [
				this.generateChartDataSet( 'Total' )
			],
		}
	}

	generateLabels() {
		let labels = [];
		Object.keys( this.statistics ).forEach( ( key ) => {
			let value = this.statistics[ key ];
			labels.push( key );
		} );
		return labels;
	}

	generateChartDataSet( label ) {
		let data = [], backgroundColor = [], borderColor = [], borderWidth = 1;
		Object.keys( this.statistics ).forEach( ( key ) => {
			let value = this.statistics[ key ];
			data.push( value );
			backgroundColor.push( this.toColor( value, 0.2 ) );
			borderColor.push( this.toColor( value + 50, 1 ) );
		} );
		return { label, data, backgroundColor, borderColor, borderWidth };
	}

	toColor( num, a ) {
		num >>>= 0;
		let b = num & 0xFF,
			g = (
					num & 0xFF00
				) >>> 8,
			r = (
					num & 0xFF0000
				) >>> 16;

		a = a || (
				(
					num & 0xFF000000
				) >>> 24
			) / 255;
		return "rgba(" + [ r, g, b, a ].join( "," ) + ")";
	}

}