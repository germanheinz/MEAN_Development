const express = require('express');
const app = express();

var Artista = require('../models/artista');
var Usuario = require('../models/usuario');
var Album = require('../models/album');

// ==============================
// Busqueda por colección
// ==============================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'albums':
            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'artistas':
            promesa = buscarHospitales(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, medicos y hospitales',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })

});


// ==============================
// Busqueda general
// ==============================
app.get('/buscar/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all([
            buscarArtistas(busqueda, regex),
            buscarAlbums(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                usuarios: respuestas[0],
                albums: respuestas[1],
                artistas: respuestas[2]
            });
        })


});


function buscarArtistas(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Artista.find({ nombre: regex })
            .populate('artista', 'nombre img')
            .exec((err, artistas) => {

                if (err) {
                    reject('Error al cargar artistas', err);
                } else {
                    resolve(artistas)
                }
            });
    });
}

function buscarAlbums(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Album.find({ nombre: regex })
            .populate('album', 'nombre img')
            .exec((err, albums) => {

                if (err) {
                    reject('Error al cargar albums', err);
                } else {
                    resolve(albums)
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Erro al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }


            })


    });
}



module.exports = app;