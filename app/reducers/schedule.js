// @flow
import {SCHEDULE_ADD, SCHEDULE_CHANGE, SCHEDULE_REMOVE} from '../actions/schedule';

export type scheduleStateType = {
    schedule: number
};

type actionType = {
    type: string
};

export default function schedule(items = [], action: actionType) {
    items = items || []; // Why??
    if (typeof items == 'undefined') {
        items = [];
    }
    console.log('schedule reducer working');
    console.log(arguments);
    switch (action.type) {
        case SCHEDULE_ADD:
            return items.slice().concat(action.item);
        case SCHEDULE_REMOVE:
            return items.splice(action.index, 1);
        case SCHEDULE_CHANGE:
            return items;
        default:
            return items;
    }
}
