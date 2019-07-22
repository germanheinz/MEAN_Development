// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

process.env.CADUCIDAD_TOKEN = 60 * 20 * 24 * 20;

process.env.SEED = process.env.SEED || 'este-es-el-seed';
// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    //urlDB = process.env.MONGO_URI;
    urlDB = 'mongodb+srv://fenix:ikkiavefenix@cluster0-bba2m.mongodb.net/GHDB';
}
process.env.URLDB = urlDB;