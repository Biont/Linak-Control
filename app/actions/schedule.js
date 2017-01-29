export const SCHEDULE_ADD = 'SCHEDULE_ADD';
export const SCHEDULE_REMOVE = 'SCHEDULE_REMOVE';
export const SCHEDULE_CHANGE = 'SCHEDULE_CHANGE';

export function onAdd(item) {
    return {
        type: SCHEDULE_ADD,
        item: item
    };
}

export function onRemove(index) {
    return {
        type: SCHEDULE_REMOVE,
        index: index
    };
}

export function onUpdate(index, item) {
    return {
        type: SCHEDULE_CHANGE,
        index: index,
        item: item
    };
}