import {BiontView} from 'biont-backbone';
import {throttle}from'underscore';


export default class ScrollSpyView extends BiontView {

    initialize() {
        super.initialize();
        this.queue = {};
        if (this.constructor.name === 'ScrollSpyView') {
            throw new TypeError("Cannot construct ScrollSpyView instances directly");
        }
    }

    render(force) {
        let rendered = this.rendered;
        super.render(force);

        if (!rendered || force) {

            let $container = (this.parent) ? this.parent.$el : $(window);
            let inside = {};

            $container.on('scroll.' + this.cid, throttle((e) => {
                $('[data-subview]', this.$el).each((idx, obj) => {
                    let $this = $(obj), subview = $this.data('subview');

                    /* if we have reached the minimum bound but are below the max ... */
                    if (this.isInView(obj)) {
                        /* trigger enter event */
                        if (!inside[subview]) {
                            inside[subview] = true;

                            /* fire enter event */
                            this.$el.trigger('scrollEnter', {
                                subview: $this.data('subview')
                            });

                        }

                        /* trigger tick event */
                        this.$el.trigger('scrollTick', {
                            inside: inside[subview],
                        });
                    } else {

                        if (inside[subview]) {
                            inside[subview] = false;
                            /* trigger leave event */
                            this.$el.trigger('scrollLeave', {
                                subview: $this.data('subview')
                            });
                        }
                    }
                });

            }, 100));

        }


    }

    isInView(el) {
        let winH = window.innerHeight,
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
            scrollBottom = scrollTop + winH,
            rect = el.getBoundingClientRect(),
            elTop = rect.top + scrollTop,
            elBottom = elTop + el.offsetHeight;
        // console.log('elTop', elTop)
        // console.log('elBottom', elBottom)
        // console.log('scrollBottom', scrollBottom)
        // console.log('scrollTop', scrollTop)
        if (elTop === elBottom && elBottom === scrollBottom) {
            // Element has 0 height and we're scrolled right to the bottom
            return true;

        }
        return (elTop < scrollBottom) && (elBottom >= scrollTop);
    };




}