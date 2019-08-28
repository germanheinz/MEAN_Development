var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var albumSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    artista: { type: Schema.Types.ObjectId, ref: 'Artista' }
});


module.exports = mongoose.model('Albums', albumSchema);