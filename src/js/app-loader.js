global.BIONT_TEMPLATE_LOADER_CONFIG = {
	tplDir: __dirname + '/tpl/'
};

jQuery( document ).ready( () => {
	console.log( jQuery.knob )

	const MainApp = require( './app.js' );
	const App = new MainApp();
	App.init();
	$( '[data-tooltip]' ).tooltip( {
		delay: 50,
	} );
} );
