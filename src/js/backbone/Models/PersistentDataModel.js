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
 * Sets up a Backbone Model to use the WP REST API
 */
class PersistentDataModel extends Backbone.Model {

    // get url() {
    // 	console.log( 'model', this.collection.endpoint );
    // 	return this.collection.endpoint;
    // }

    sync(method, model, options) {
        console.log(arguments);
        const store = require('electron-settings');
        let resp, errorMessage;
        const syncDfd = getDeferred();
        let key = this.getKey(model);
        let data = model.attributes;
        console.log(key);
        try {
            switch (method) {
                case 'read':
                    resp = isUndefined(model.id) ? store.getAll() : store.get(key, data);
                    break;
                case 'create':
                case 'patch':
                case 'update':
                    resp = store.set(key, data);
                    break;
                case 'delete':
                    console.log(store.getAll());
                    console.log(store.get(key));
                    resp = store.delete(key);
                    console.log(store.get(key));
                    break;
            }

        } catch (error) {
            errorMessage = error.message;
        }

        if (resp) {
            if (options.success) {
                options.success.call(model, resp, options);
            }
            if (syncDfd) {
                syncDfd.resolve(resp);
            }

        } else {
            errorMessage = errorMessage ? errorMessage : 'Record Not Found';

            if (options.error) {
                options.error.call(model, errorMessage, options);
            }
            if (syncDfd) {
                syncDfd.reject(errorMessage);
            }
        }

        // add compatibility with $.ajax
        // always execute callback for success and error
        if (options.complete) {
            options.complete.call(model, resp);
        }

        return syncDfd && syncDfd.promise();
    }

    getKey(model) {
        if (isUndefined(model.id)) {
            model.id = model.cid;

        }
        return model.constructor.name + '.' + model.id;
    }
}

module.exports = PersistentDataModel;