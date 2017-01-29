import Sudo from 'sudo-prompt';
class LinakUtil {
    /**
     * Configure the sudo prompt
     */
    constructor() {

        this.options = {
            name: 'Electron',
            icns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
        };
    }

    /**
     * Execute the elevated call to the USB driver
     *
     * @param position
     * @param callback
     */
    moveTo(position: number = 0, callback) {
        console.log('Attempting to move the table to position ' + position);
        Sudo.exec('bin/example-moveTo ' + position, this.options, function (error, stdout, stderr) {
            console.log(arguments);
            if (error) {
                alert(stderr);
            }
        });
    }


}

export default new LinakUtil();