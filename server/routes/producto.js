const express = require('express');

const Producto = require('../models/producto');

const Categoria = require('../models/categoria');

const Usuario = require('../models/usuario');

const { verificaToken } = require('../middlewares/autenticacion');

const app = express();


//mostrat todas las categorias
app.get('/productos', verificaToken, (req, res) => {

    let body = req.body;

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')

    .exec((err, productos) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        } else {
            return res.json({
                ok: true,
                productos
            });
        }
    });
})

//mostrar todas las Productos
app.get('/productos/:id', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Error al cargar Productos'
                    }
                });

            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no es valido'
                    }
                });

            } else {
                return res.json({
                    ok: true,
                    productoDB
                });
            }
        });
})

// ===========================
//  Buscar productos
// ===========================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        })
});




//Cargar Productos
app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        usuario: req.body._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });

        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Error al cargar Categoria'
                }
            });

        } else {
            res.json({
                ok: true,
                productoDB
            });
        }
    });
})

//Cargar categorias
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id de producto no existe'
                }
            });

        }


        productoDB.nombre = body.nombre,
            productoDB.precioUni = body.precioUni,
            productoDB.disponible = body.disponible,
            productoDB.categoria = body.categoria

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoGuardado
            });
        })



    });
})

//Eliminar categorias
app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findByIdAndDelete(id, (err, productoDB) => {

        if (err) {
            res.json(400).json({
                ok: false,
                err: {
                    message: 'Error al cargar Producto'
                }
            });

        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Id no existe Producto'
                }
            });
        } else {
            return res.json({
                ok: true,
                productoDB
            });
        }
    });
})
















module.exports = app;