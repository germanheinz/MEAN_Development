const jwt = require('jsonwebtoken');

//verificar token
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decoded.usuario;
        next();

    });

};

//verificar Admin Role
let verificaRole_o_mismoUser = (req, res, next) => {

    let usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
    } else {
        res.json({
            ok: false,
            err: {
                message: 'El usuario no es Administrador',
                errors: { message: 'No es Admin' }
            }
        });
    }

}


module.exports = { verificaToken, verificaRole_o_mismoUser };