import BiontView from "./BiontView.js";
import ItemView from "./ScheduleItemView";

export default class ListView extends BiontView.extend( {
	tagName: 'ul',
	events : {}
} ) {

	/**
	 * Initialize this class
	 */
	constructor( data, options ) {
		super( data, options );
		this.view = data.view || ItemView;
		this.filterStatus = data.filterStatus || [];

		if ( data.rowActionsView ) {
			this.rowActionsView = data.rowActionsView;
		}

		this.listenTo( this.collection, "sync", this.render );
		this.listenTo( this.collection, "change:status", this.render );
		this._views = new Map();
		this.$el.empty();
	}

	/**
	 * Handle output
	 */
	render() {
		/**
		 * Don't render if the list cannot be seen.
		 * Keep an eye on this and see if it causes problems
		 */
		if ( !this.$el.is( ':visible' ) ) {
			return this;
		}

		let models = this.collection.filter( this.filterItem.bind( this ) );
		console.log( models );
		this.removeObsoleteViews( models );

		//TODO This is an example for how we could sort the models before rendering
		// However, since the actual rendering code cannot re-sort on the fly,
		// it will only work the first time the list is rendered.

		// let pinStatus = [ 'active' ];
		// console.log( pinStatus );
		// if ( pinStatus ) {
		// 	models = _.sortBy( models, ( model )=> {
		// 		let index = jQuery.inArray( model.get( 'status' ), pinStatus );
		// 		return index !== -1 ? index : models.length;
		// 	} );
		// }
		// debugger;

		let curView;
		models.forEach( ( item ) => {
			if ( !this._views.has( item ) ) {
				let viewArgs = {
					tagName: 'li',
					model  : item,
				};
				if ( this.rowActionsView ) {
					viewArgs.rowActionsView = this.rowActionsView
				}
				let itemView = new this.view( viewArgs );
				this._views.set( item, itemView );
				let $el = itemView.render().$el;

				/**
				 * Keep sort order
				 */
				if ( curView === undefined ) {
					this.$el.prepend( $el );
				} else {
					$el.insertAfter( curView.$el );
				}

				$el.css( 'display', 'none' ).slideDown( 275 );
			}

			curView = this._views.get( item );
		} );
		return this;
	}

	/**
	 * Walks over the views map and kills all
	 * views that are not present in the current selection of models
	 *
	 * @param models
	 */
	removeObsoleteViews( models ) {
		this._views.forEach( ( view, model ) => {
			if ( jQuery.inArray( model, models ) === -1 ) {
				this._views.get( model ).remove();
				this._views.delete( model );
			}
		} )
	}

	/**
	 * Filter callback.
	 *
	 * Checks if the current item status is present in this ViewCollection's allowed status
	 *
	 * @param item
	 * @returns {boolean}
	 */
	filterItem( item ) {
		return true;
		return jQuery.inArray( item.get( 'status' ), this.filterStatus ) !== -1;
	}
}