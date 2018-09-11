import '../scss/main.scss';
const controller = require('./MVC/controller.js');

window.addEventListener('load', () => {
    controller.init();
});