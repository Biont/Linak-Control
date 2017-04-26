import {ipcRenderer, remote} from "electron";
import Backbone from "backbone";
import {isUndefined, result} from "underscore";

/** Get the Deferred status from $ if we have jQuery, otherwise use Backbone's
 *  @returns {boolean} - Whether the request was deferred
 */
function getDeferred() {
    if (Backbone.$) {
        return result(Backbone.$, 'Deferred', false);
    }
    return result(Backbone, 'Deferred', false);
}

/**
 * Created by biont on 21.04.17.
 */
export default class PersistentDataCollection extends Backbone.Collection {

    constructor(models, options) {
        super(models, options);
        this.model = options.model || Backbone.Model;
        this.comparator = options.comparator;
        this.endpoint = options.endpoint;
        if (options.requestParams) {
            this.requestParams = options.requestParams;

        }
    }

    sync(method, model, options) {
        const syncDfd = getDeferred();

        let key = isUndefined(model.id) ? this.model.name : model.constructor.name + '.' + model.cid;
        let data = model.toJSON();
        model.trigger('request', model, syncDfd, options);
        ipcRenderer.send('electron-settings-change', {method, key, data, replyContext: this.getReplyContext()});

        // add compatibility with $.ajax
        // always execute callback for success and error
        ipcRenderer.once(this.getReplyContext(), (event, result) => {

            if (result) {
                /**
                 * When fetching the entire collection,
                 * we'll receive an array-like object which needs to be converted to a proper array
                 */
                if (isUndefined(model.id)) {
                    result = $.map(result, function (value, index) {
                        value.id = value.id || index;
                        return [value];
                    });
                }
                syncDfd.resolve();

                if (options.success) {
                    options.success.call(model, result, options);
                }
                if (options.complete) {

                    options.complete.call(model, result);
                }
            } else {
                let errorMessage = 'Record Not Found';
                if (options.error) {
                    options.error.call(model, errorMessage, options);
                }
                if (syncDfd) {
                    syncDfd.reject(errorMessage);
                }
            }

        });
        return syncDfd && syncDfd.promise();
    }

    fetch() {
        super.fetch(
            {
                add: true,
                remove: true,
                merge: true,
                data: this.queryArgs,
                success: () => {
                    console.log('fetch', arguments);
                    this.checkEmpty();
                }
            }
        );
    }

    checkEmpty() {
        if (this.isEmpty()) {
            this.trigger('empty', this)
        }
    }

    getReplyContext() {
        return 'asyncSettingsReply:' + this.constructor.name;
    }
}