import PersistentDataModel from "./PersistentDataModel";
import {isUndefined, result} from "underscore";

/**
 * Sets up a Backbone Model to use the WP REST API
 */
export default class ScheduleItem extends PersistentDataModel {
    /**
     *
     * @returns {Date}
     */
    getDate() {
        if (isUndefined(this.dateObj)) {
            let data = this.get('time').split(':');
            this.dateObj = new Date();
            this.dateObj.setHours(data[0]);
            this.dateObj.setMinutes(data[1]);
            this.dateObj.setSeconds('00');
        }

        return this.dateObj;
    }

    getTimeStamp() {
        return this.getDate().getTime();
    }
}
