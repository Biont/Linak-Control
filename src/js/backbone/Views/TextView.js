
/**
 * Does nothing but display a text message
 */
export default class TextView extends Backbone.View {
    constructor(data, options) {
        super(data, options);
        this.text = data.text;
    }

    /**
     * Very basic render function.
     * @returns {TextModalView}
     */
    render() {
        this.$el.html(this.text);
        return this;
    }

}