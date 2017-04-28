import Backbone from "backbone";
import {each} from "underscore";

import fs from "fs";
import ejs from "ejs";
import TemplateHelpers from "../TemplateHelpers";
const tplDir = '../../tpl/';

require.extensions['.ejs'] = function (module) {
    let filename = module.filename;
    let options = {filename: filename, client: true, compileDebug: true};
    let template = fs.readFileSync(filename).toString().replace(/^\uFEFF/, '');
    let fn = ejs.compile(template, options);
    return module._compile('module.exports = ' + fn.toString() + ';', filename);
};

export default class BiontView extends Backbone.View.extend({
    subViews: {}
}) {
    /**
     * Make all BRViews use our own TemplateLoader
     *
     * @returns {*}
     */
    get template() {
        return this.getTemplate()
    }

    constructor(data = {}, options = {}) {
        super(data, options);
        if (data.subViews) {
            this.subViews = data.subViews;
        }
        this.parent = null;
        // this.subViews = data.subViews;
        if (this.constructor.name === 'BiontView') {
            throw new TypeError("Cannot construct BiontView instances directly");
        }
    }

    /**
     * Retrieves a template from the DOM
     *
     * @param tplOverride
     * @returns {string}
     */
    getTemplate(tplOverride) {

        let tpl;

        /**
         * Try to find a given override first
         */
        tplOverride = __dirname + '/' + tplDir + tplOverride + '.ejs';

        if (tplOverride && (
                fs.existsSync(tplOverride)
            )) {
            return require(tplOverride);
        }

        /**
         * Walk up the prototype chain to find matching templates
         */
        let curObject = this;
        while (curObject && curObject.constructor.name !== 'BiontView') {
            let tplModule = __dirname + '/' + tplDir + curObject.constructor.name + '.ejs';
            if (fs.existsSync(tplModule)) {
                return require(tplModule);
            }
            curObject = Object.getPrototypeOf(curObject);
        }

        console.error('Could not find template for View ' + this.constructor.name);
        return function () {
            return '<div class="tplError">MISSING TEMPLATE</div>'
        };
    }

    /**
     * Very basic render function.
     * @returns {BiontView}
     */
    render(viewData = {}) {
        if (!this.rendered) {
            let data = this.model ? this.model.toJSON() : viewData;
            _.extend(data, TemplateHelpers);

            this.$el.html(this.template(data));
            this.autoBind();
            this.rendered = true;
        }
        this.autoSubView();

        return this;
    }

    autoSubView() {
        $('[data-subview]', this.$el).each((idx, obj) => {
            let $this = $(obj), data = $this.data();
            if (!data.subview) {
                console.error('empty subview attribute');
                return;
            }

            if (!this.subViews.hasOwnProperty(data.subview)) {
                return;
            }
            if (data.subviewparent && data.subviewparent !== this.cid) {
                console.log('no want');

                return;
            }
            // Re-render existing instance, if available
            if (data.subviewinstance) {
                data.subviewinstance.render();
                return;
            }

            let view = this.subViews[data.subview];

            if (typeof view === 'function') {
                // Support traditional and arrow functions to some extent
                view = view.call(this, this);
                view.parent = this;
                view.setElement($this).render();
                $this.data('subviewparent', this.cid);
            } else {
                view.render();
            }
            $this.data('subviewinstance', view);

        });
    }

    autoBind() {
        if (!this.model) {
            return;
        }
        $('[data-bind]', this.$el).each((idx, obj) => {
            let $this = $(obj), data = $this.data();
            if (!data.bind) {
                console.error('empty tag');
                return;
            }
            switch ($this.prop('tagName')) {
                case 'INPUT':
                    this.bindInput($this, data.bind);
                    break;
                default:
                    this.bindDefault($this, data.bind);
                    break;

            }
        });
    }

    bindDefault($element, attr) {
        $element.html(this.model.get(attr));
        this.listenTo(this.model, 'change', (model) => $element.html(model.get(attr)));
    }

    bindInput($element, attr) {
        $element.change(() => this.model.set(attr, $element.val()));
        this.listenTo(this.model, 'change', (model) => $element.val(model.get(attr)));
    }

    dump() {
        console.log(this.model);
        return this.model.toJSON();
    }

    /**
     * Assigns a selector within the template to a specific subview, which will then get rendered
     * @param view
     * @param selector
     */
    assign(view, selector) {
        selector = selector || '[data-subview="' + view.constructor.name + '"]';

        let $el;

        if ($el = this.$(selector, this.$el)) {
            view.setElement($el).render();

        }
    }

}
