import BiontView from "./BiontView.js";
import ScheduleFormView from "./ScheduleFormView";

export default class ScheduleItemView extends BiontView.extend({
    events: {
        'click [data-action]': 'onButtonClick',
        'click [data-action="save"]': 'save',
    }
}) {
    constructor(data, options) {
        /**
         * Setup default subViews
         * @type {{form: ScheduleFormView}}
         */
        data.subViews = data.subViews || {
                form: new ScheduleFormView({
                    model: data.model
                })
            };
        super(data, options);

        this.form = new ScheduleFormView({
            model: data.model
        });
        this.listenTo(this.model, 'destroy', this.remove);
    }

    onButtonClick(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        let action = jQuery(e.currentTarget).data('action');
        switch (action) {
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
        this.$el.slideUp(275, () => {
            super.remove()
        });
    }
}
