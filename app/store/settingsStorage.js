import settings from 'electron-settings';

export default class SettingsStorage {
    constructor() {
        console.log('STORAGE!!!');
    }

    setItem(key: string, value: string, callback?: ?(error: ?Error) => void) {
        console.log('setItem!', arguments);
    }


    getItem(key: string, callback?: ?(error: ?Error, result: ?string) => void) {
        console.log('getItem!', arguments);

    }


    removeItem(key: string,
               callback?: ?(error: ?Error) => void) {
    }


    getAllKeys(callback?: ?(error: ?Error, keys: ?Array<string>) => void) {
        console.log('getAllKeys!', arguments);
        return  settings.get().then(val => {
            console.log(val);
            // => "Cosmo"
            callback && callback(val);
        });
    }
};