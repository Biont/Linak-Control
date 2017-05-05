import {app, BrowserWindow, Menu, Tray} from "electron";
const Background = require( './background' );
const path = require( 'path' );
const url = require( 'url' );
const iconPath = path.join( __dirname, 'icons/' );
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

class Main {
	constructor() {
	}

	getTray() {
		if ( !this.tray ) {
			this.tray = new Tray( iconPath + 'app-128.png' );

			let contextMenu = Menu.buildFromTemplate( [
				{
					label      : 'Show Window',
					accelerator: 'Alt+Command+I',
					click      : () => win.show()
				},
				{
					label      : 'Quit',
					accelerator: 'Command+Q',
					click      : () => {
						app.isQuiting = true;
						app.quit()
					}
				}
			] );
			this.tray.setToolTip( 'This is my application.' );
			this.tray.setTitle( 'This is my application.' );
			this.tray.setContextMenu( contextMenu );
			this.tray.on( 'click', () => (
				win.isVisible()
			) ? win.hide() : win.show() )
		}
		return this.tray;
	}

	register() {
		// This method will be called when Electron has finished
		// initialization and is ready to create browser windows.
		// Some APIs can only be used after this event occurs.
		app.on( 'ready', () => this.spawnApp() );

		// Quit when all windows are closed.
		app.on( 'window-all-closed', () => {
			// On macOS it is common for applications and their menu bar
			// to stay active until the user quits explicitly with Cmd + Q
			// if ( process.platform !== 'darwin' ) {
			// 	app.quit()
			// }
		} );

		app.on( 'activate', () => {
			// On macOS it's common to re-create a window in the app when the
			// dock icon is clicked and there are no other windows open.
			if ( win === null ) {
				getWindow()
			}
		} );
	}

	spawnApp() {

		app.on( 'browser-window-created', function( e, window ) {
			window.setMenu( null );
		} );

		win = this.getWindow();
		this.tray = this.getTray();

		(
			new Background.default( win )
		).init();

	}

	getWindow() {
		if ( win instanceof BrowserWindow ) {
			return win;
		}

		// Create the browser window.
		win = new BrowserWindow( {
			width         : 800,
			height        : 600,
			webPreferences: {
				blinkFeatures: 'OverlayScrollbars'
			},
			icon          : iconPath + 'app-256.png'
		} );

		// and load the index.html of the app.
		win.loadURL( url.format( {
			pathname: path.join( __dirname, 'index.html' ),
			protocol: 'file:',
			slashes : true
		} ) );
		// Open the DevTools.
		win.webContents.openDevTools();

		win.on( 'minimize', function( event ) {
			event.preventDefault();
			win.hide();
		} );

		win.on( 'close', function( event ) {
			if ( !app.isQuiting ) {
				event.preventDefault()
				win.hide();
			}
			return false;
		} );

		// Emitted when the window is closed.
		win.on( 'closed', () => {
			// Dereference the window object, usually you would store windows
			// in an array if your app supports multi windows, this is the time
			// when you should delete the corresponding element.
			win = null
		} );
		return win;
	}
}

const main = new Main();
main.register();

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.