import {dialog, ipcMain} from "electron";
import SchedulerLogic from "./util/schedulerLogic";
import Linak from "./util/linakUtil";
const namespace = 'ScheduleItem';

/**
 * Runs in the background and performs actions when needed
 */
export default class Background {
    constructor(settings) {
        this.settings = settings;
        this.linak = new Linak();
        this.scheduler = new SchedulerLogic(this.settings.get(namespace), [
            {
                delay: 0,
                callback: (item) => {
                    this.linak.moveTo(item.height, () => {
                        console.log('Linak done firing');
                    });
                }
            }
        ]);
    }

    init() {

        this.scheduler.boot();

        // Listen for async message from renderer process
        ipcMain.on('electron-settings-change', (event, arg) => {
            console.log('IPC!! SETIINGS CHANGED!', arg);
            this.scheduler.setData(this.settings.get(namespace));
            this.scheduler.enqueue();
        });
    }

}