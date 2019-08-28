const express = require('express');

const app = express();

app.use(require('./usuario'));

app.use(require('./login'));

app.use(require('./categoria'));

app.use(require('./album'));

app.use(require('./upload'));

app.use(require('./imagenes'));

app.use(require('./artista'));

app.use(require('./busqueda'));

module.exports = app;