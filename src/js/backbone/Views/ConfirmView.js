import ModalView from "./ModalView";
/**
 * Creates a fullscreen popup box with custom content
 */
export default class ConfirmView extends ModalView.extend({
    events: {
        'click [data-confirm]': 'onConfirmBtn',
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

        this.confirmBtnText = data.confirmBtnText || 'Yes';
        this.closeBtnText = data.closeBtnText || 'No';
        this.confirm = data.confirm || function () {
                console.log('Empty Confirm')
            };

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
            closeBtnText: this.closeBtnText,
            confirmBtnText: this.confirmBtnText
        };
        this.$el.html(this.template(data));
        this.autoSubView();
        setTimeout(() => jQuery('.biont-modal-content', this.$el).addClass('scale-in'), 100);

        return this;
    }

    onConfirmBtn() {
        this.trigger('confirm:button', this);
        this.trigger('confirm', this);
        this.confirm.call(this);
        this.remove();

    }

    onCancelBtn() {
        this.trigger('remove:button', this);
        this.remove();

    }

}