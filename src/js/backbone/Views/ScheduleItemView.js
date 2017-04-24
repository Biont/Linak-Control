import BiontView from "./BiontView.js";
import ScheduleFormView from "./ScheduleFormView";

export default class ScheduleItemView extends BiontView.extend({
    events: {
        'click [data-action]': 'onButtonClick',
        'click [data-action="save"]': 'save',
        'change input': 'onChange'
    }
}) {
    constructor(data, options) {
        super(data, options);
        this.form = new ScheduleFormView({
            model: data.model
        });
        this.listenTo(this.model, 'destroy', this.remove);
    }

    onChange(e) {
        let $input = jQuery(e.target);
        switch ($input.attr('type')) {
            case'time':
                this.model.set('time', $input.val());
                break;
            case'range':
                this.model.set('height', $input.val());
        }
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
                console.log('isNew', this.model.isNew());
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

    render() {
        super.render();
        this.assign(this.form, '[data-schedule-form]');
        return this;
    }
}
