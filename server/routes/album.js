const express = require('express');

const Album = require('../models/album');

const Categoria = require('../models/categoria');

const Usuario = require('../models/usuario');

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();


//mostrat todas las categorias
app.get('/albums', (req, res) => {

    Album.find({})
        .populate('artista')
        .exec(
            (err, albums) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        errors: err
                    });
                }

                Album.countDocuments((err, total) => {
                    return res.json({
                        ok: true,
                        albums,
                        total
                    });

                })

            });
});

//mostrar todas las albums
app.get('/albums/:id', (req, res) => {

    let id = req.params.id;

    Album.findById(id)
        .populate('artista')
        .exec((err, album) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Error al cargar albums'
                    }
                });

            }
            if (!album) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no es valido'
                    }
                });

            } else {
                Album.countDocuments((err, total) => {
                    return res.json({
                        ok: true,
                        album,
                        total
                    });
                });

            }
        });
})

// ===========================
//  Buscar albums
// ===========================
app.get('/albums/buscar/:termino', (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Album.find({ nombre: regex })
        .populate('album', 'nombre')
        .populate('artista', 'nombre')
        .exec((err, albums) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                albums
            })

        })
});




//Cargar albums
app.post('/albums', (req, res) => {

    let body = req.body;

    let album = new Album({
        nombre: body.nombre,
        artista: body.artista,
    });

    album.save((err, albumDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }
        if (!albumDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error al cargar Album'
                }
            });

        } else {
            res.json({
                ok: true,
                album
            });
        }
    });
})

//Cargar album
app.put('/albums/:id', (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Album.findById(id, (err, albumDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }
        if (!albumDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id de album no existe'
                }
            });

        }


        albumDB.nombre = body.nombre,
            albumDB.categoria = body.categoria,
            albumDB.artista = body.artista

        albumDB.save((err, albumGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                albumGuardado
            });
        })



    });
})

//Eliminar album
app.delete('/albums/:id', (req, res) => {

    let id = req.params.id;

    Album.findByIdAndDelete(id, (err, albumDB) => {

        if (err) {
            res.json(400).json({
                ok: false,
                err: {
                    message: 'Error al cargar album'
                }
            });

        }
        if (!albumDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id no existe album'
                }
            });
        } else {
            return res.json({
                ok: true,
                albumDB
            });
        }
    });
})
















module.exports = app;