const express = require('express');

const app = express();

let Categoria = require('../models/categoria');

const { verificaToken, verificaRole_o_mismoUser } = require('../middlewares/autenticacion');


//mostrat todas las categorias
app.get('/categoria', verificaToken, (req, res) => {

        Categoria.find({})
            .sort('descripcion')
            .populate('usuario', 'nombre email')
            .exec((err, categorias) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Error al cargar Categorias'
                        }
                    });

                } else {
                    return res.json({
                        ok: true,
                        categorias
                    });
                }
            });
    })
    //mostrar todas las categorias
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error al cargar Categorias'
                }
            });

        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no es valido'
                }
            });

        } else {
            return res.json({
                ok: true,
                categoriaDB
            });
        }
    });
})

//Cargar categorias
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Error 500'
                }
            });

        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error al cargar Categoria'
                }
            });

        } else {
            res.json({
                ok: true,
                categoriaDB
            });
        }
    });
})

//Cargar categorias
app.put('/categoria/:id', (req, res) => {

        let id = req.params.id;
        let body = req.body;
        let descripcion = body.descripcion;

        let descCategoria = {
            descripcion
        };

        Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });

            }
            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Error al cargar Categoria'
                    }
                });

            } else {
                res.json({
                    ok: true,
                    categoriaDB
                });
            }
        });
    })
    //Eliminar categorias
app.delete('/categoria/:id', [verificaToken, verificaRole_o_mismoUser], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {

        if (err) {
            res.json(400).json({
                ok: false,
                err: {
                    message: 'Error al cargar Categorias'
                }
            });

        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error al cargar Categoria'
                }
            });
        } else {
            return res.json({
                ok: true,
                categoriaDB
            });
        }
    });
})


module.exports = app;