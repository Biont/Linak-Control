import BiontView from "./BiontView.js";
import ModalView from "./ModalView";
import ScheduleFormView from "./ScheduleFormView";

import ListView from "./ListView.js";
import ScheduleItemView from "./ScheduleItemView.js";
import ScheduleItem from "../Models/ScheduleItem.js";
const TemplateHelpers = require('../TemplateHelpers');

export default class AppView extends BiontView.extend({
    events: {
        "click [data-add]": "open",
        "click [data-delete-all]": "deleteAll",
    }
}) {

    constructor(data, options) {
        super(data, options);
        this.collection = data.collection;
        this.listView = new ListView({
            view: ScheduleItemView,
            collection: this.collection
        });
        this.listenTo(this.collection, 'empty', this.open);
    }

    open() {
        let newItem = new ScheduleItem({
            time: (
                new Date()
            ).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
        });
        let modal = new ModalView({
                closeBtnText: 'Save',
                content: new ScheduleFormView({
                    model: newItem
                })
            }
        );

        modal.render();
        this.listenTo(modal, 'remove', function () {
            console.log('wooo');
            newItem.save();
            this.collection.fetch();
        });
        //
        // this.collection.create( {
        // 		time: 'hurrrrr'
        // 	},
        // 	{
        // 		wait   : true,
        // 		//TODO decouple from $author, $email and then move this in a separate class method
        // 		success: ( model, collection, raw ) => {
        // 			console.log( arguments );
        // 			// $author.val( "" );
        // 			// $email.val( "" );
        // 			// $content.val( "" );
        //
        // 			// let alert = new AlertBoxView( {
        // 			// 	'messageText'    : TemplateHelpers._e(
        // 			// 		'Your question has been posted and is awaiting moderation.' ),
        // 			// 	'closeButtonText': 'OK',
        // 			// 	// 'autoClose'      : 5000
        // 			// } );
        // 			// alert.render();
        //
        // 		},
        // 		error  : function( model, response ) {
        // 			console.log( arguments );
        // 			console.trace();
        // 		}
        // 	} );
    }

    render() {
        super.render();
        this.assign(this.listView, '[data-schedule]');
    }

    deleteAll() {
        const store = require('electron-settings');
        store.deleteAll();
        this.collection.fetch();
    }

};