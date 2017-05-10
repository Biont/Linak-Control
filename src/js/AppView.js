import LazyLoadView from './LazyLoadView';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

export default class AppView extends LazyLoadView.extend({
    subViews: {
        header: () => new Header(),
        content: () => new Content(),
        footer: () => new Footer()
    },
}) {
    render(force) {
        let rendered = this.rendered;
        super.render(force);

        if (!rendered || force) {
            this.$el.on('scrollEnter', (e, data) => {
                console.log('scrollEnter', data);
            })

            this.$el.on('scrollLeave', (e, data) => {
                console.log('scrollLeave', data);
            })
        }
    }

}