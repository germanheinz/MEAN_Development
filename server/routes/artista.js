const express = require('express');

const Artista = require('../models/artista');

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();


//mostrar todas las categorias
app.get('/artistas', (req, res) => {

    let body = req.body;

    Artista.find()

    .exec((err, artistas) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        } else {

            Artista.countDocuments((err, total) => {
                return res.json({
                    ok: true,
                    artistas,
                    total
                });
            });

        }
    });
})

//Buscar Artista por ID
app.get('/artista/:id', function(req, res) {

    let id = req.params.id;

    Artista.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, artista) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!artista) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El Artista no existe',
                    errors: { message: 'No existe el Artista con ese ID' }
                })
            }
            res.json({
                ok: true,
                artista: artista
            });

        })

});

app.put('/artista/:id', function(req, res) {

    let id = req.params.id;
    let body = req.body;

    Artista.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, artistaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            artista: artistaDB
        });

    })

});

app.delete('/artista/:id', (req, res) => {


    let id = req.params.id;

    Artista.findByIdAndRemove(id, (err, artistaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!artistaBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            artistaBorrado
        });

    });
});
// ===========================
//  Buscar Artista
// ===========================
app.get('/artistas/buscar/:termino', (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Artista.find({ nombre: regex })
        //.populate('email', 'nombre')
        .exec((err, artista) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                artista
            })

        })
});

app.post('/artista', function(req, res) {

    let body = req.body;

    let artista = new Artista({
        nombre: body.nombre
    });


    artista.save((err, artistaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            artista: artistaDB
        });


    });


});


module.exports = app;