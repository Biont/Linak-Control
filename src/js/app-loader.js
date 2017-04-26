const MainApp = require('./app.js');
const App = new MainApp();
$(document).ready(() => {
    App.init();
    $('.collapsible').collapsible();
});