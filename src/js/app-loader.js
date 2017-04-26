import MainApp from'./app.js';
const App = new MainApp();
jQuery(document).ready(() => {
    App.init();
    $('.collapsible').collapsible();
});