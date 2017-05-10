import ScrollSpyView from './ScrollSpyView';
export default class LazyLoadView extends ScrollSpyView.extend() {

    initialize() {
        super.initialize();
        this.queue = {};
        if (this.constructor.name === 'LazyLoadView') {
            throw new TypeError("Cannot construct LazyLoadView instances directly");
        }
    }

    render(force) {
        let rendered = this.rendered;
        super.render(force);

        if (!rendered || force) {
            this.$el.on('scrollEnter', (e, data) => {
                if (this.queue[data.subview]) {
                    console.log('lazy rendering', this.queue[data.subview]);
                    this.renderSubView(
                        data.subview,
                        this.queue[data.subview].view,
                        this.queue[data.subview].element,
                        this.queue[data.subview].forced
                    );
                    delete this.queue[data.subview];
                }
            })

            this.$el.on('scrollLeave', (e, data) => {
                console.log('scrollLeave', data);
            })
        }
    }

    shouldRenderSubView(handle, view, element, forced) {
        let inView = this.isInView(element[0]);
        if (!inView) {
            console.log('added to queue', handle);
            this.queue[handle] = {view, element, forced};
        }
        return inView;
    }
}