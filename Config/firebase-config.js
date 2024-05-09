const admin = require('firebase-admin');

const serviceAccount = require('./services/home-hancer.json');

admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;