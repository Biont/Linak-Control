import {exec} from "child_process";
export default class LinakUtil {
    /**
     * Configure the sudo prompt
     */
    constructor() {

    }

    /**
     * Execute the elevated call to the USB driver
     *
     * @param position
     * @param callback
     */
    moveTo(position = 0, callback) {
        console.log('Attempting to move the table to position ' + position);

        exec(__dirname + '/bin/example-moveTo ' + position, (error, stdout, stderr) => {
            console.log(arguments);
            if (error) {
                console.error(`Error code ${error.code}, signal ${error.signal}: ${error}`);
            }
            callback(error, stdout, stderr)
        });
    }

    getHeight(callback) {
        exec(__dirname + '/bin/example-getHeight', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error code ${error.code}, signal ${error.signal}: ${error}`);
            }
            let parts = stdout.split(' ');
            let data = {
                signal: parts[2],
                cm: parts[3],
                raw: stdout
            };

            callback(error, data)
        });
    }

}