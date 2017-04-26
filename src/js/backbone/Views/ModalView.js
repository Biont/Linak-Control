import BiontView from "./BiontView";
/**
 * Creates a fullscreen popup box with custom content
 */
export default class ModalView extends BiontView.extend({
    events: {
        'click [data-cancel]': 'onCancelBtn',
    }
}) {
    /**
     * Setup the editor-specific events and arguments
     *
     * @param data
     * @param options
     */
    constructor(data, options) {
        super(data, options);

        this.header = data.header || false;
        this.closeBtnText = data.closeBtnText || 'OK';

        jQuery('body').append(this.$el);

        if (data.autoClose !== undefined) {
            setTimeout(() => this.remove(), data.autoClose);
        }
        jQuery(document).keyup(this.keyAction.bind(this));
    }

    keyAction(e) {
        let code = e.keyCode || e.which;
        if (code === 27) {
            this.trigger('remove:escape', this);
            this.remove();
        }
    }

    remove() {
        jQuery('.biont-modal-content', this.$el).removeClass('scale-in');
        setTimeout(() => {
            this.trigger('remove', this);
            super.remove();
        }, 350);

    }

    /**
     * Render the alert box
     *
     * @returns {ModalView}
     */
    render() {
        let data = {
            header: this.header,
            closeBtnText: this.closeBtnText
        };
        this.$el.html(this.template(data));
        this.autoSubView();
        if (this.content) {
            this.assign(this.content, '[data-biont-modal-view]');

        }
        setTimeout(() => jQuery('.biont-modal-content', this.$el).addClass('scale-in'), 100);

        return this;
    }

    onCancelBtn() {
        this.trigger('remove:button', this);
        this.remove();

    }

}