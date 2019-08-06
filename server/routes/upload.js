//fileupload es el repositorio para subir imagen/ 
// todo copiado de la pagina de git fileupload example

const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
//models
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
//Fileupload, Path
const fs = require('fs');
const path = require('path');
// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: ' No se ha seleccionado ningun archivo'
                }
            });
    }
    //validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Los tipos validos son ' + tiposValidos.join(','),
                    tipos: tipo
                }
            })
    }



    //archivo es el nombre del form al que se hace submit
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    console.log(extension);

    let extensionesValidas = ['png', 'jpg', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'las estensiones validas son ' + extensionesValidas.join(','),
                    ext: extension
                }
            })
    }
    //Cambiar nombre del archivo
    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`


    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }
        if (tipo == 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }



    });
});
//aca ya se que se cargo la imagen
function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }
        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'usuario no existe'
                    }
                });
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioDB) => {

            res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreArchivo
            })
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, ProductoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }
        if (!ProductoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'Producto no existe'
                    }
                });
        }

        borraArchivo(ProductoDB.img, 'productos');

        ProductoDB.img = nombreArchivo;
        ProductoDB.save((err, ProductoGuardado) => {

            res.json({
                ok: true,
                Producto: ProductoGuardado,
                img: nombreArchivo
            })
        });
    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}


module.exports = app;