const MainApp = require( './app/app.js' );
const App = new MainApp();
$( document ).ready( () => {
	App.init();
	$('.collapsible').collapsible();
	$('.timepicker').pickatime({
		autoclose: false,
		twelvehour: false,
		default: '14:20:00'
	});
} );