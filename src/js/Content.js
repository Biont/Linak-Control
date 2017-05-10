import {BiontView} from 'biont-backbone';
import Grid from './Grid';
export default class Content extends BiontView.extend({
    subViews: {
        grid: () => new Grid()
    }
}) {


}