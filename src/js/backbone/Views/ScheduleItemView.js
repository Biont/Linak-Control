import BiontView from "./BiontView.js";
import ScheduleFormView from "./ScheduleFormView";

export default class ScheduleItemView extends BiontView.extend( {
	events    : {
		'click [data-action]': 'onButtonClick',
	},
	subViews  : {
		form: ( _this ) => new ScheduleFormView( {
			model: _this.model
		} )
	},
	formatters: {
		height: ( value, instance ) => Math.round( value / 98.0 + parseFloat( instance.settings.get( 'heightOffset' ) ) ).toFixed( 1 ) + 'cm'
	}
} ) {
	constructor( data, options ) {
		super( data, options );
		this.settings = data.settings;
		this.listenTo( this.model, 'destroy', this.remove );
	}

	onButtonClick( e ) {
		e.preventDefault();
		e.stopImmediatePropagation();
		let action = jQuery( e.currentTarget ).data( 'action' );
		switch ( action ) {
			case'save':
				this.save();
				break;
			case'remove':
				this.model.destroy();
		}
	}

	save() {
		this.model.save();
	}

	/**
	 * Slides up and then kills the view
	 */
	remove() {
		this.$el.slideUp( 275, () => {
			super.remove()
		} );
	}

}
