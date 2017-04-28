import MainApp from'./app.js';
const App = new MainApp();
jQuery(document).ready(() => {
    App.init();
    $('[data-tooltip]').tooltip({
        delay: 50,
    });
});