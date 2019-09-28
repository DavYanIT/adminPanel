const bcrypt = require('bcrypt-nodejs'),
    { SECRET_KEY } = require('./configs'),
    jwt = require('jsonwebtoken');

exports.encrypt = (pass) => new Promise((resolve, reject) => {
    bcrypt.genSalt(5, function(err, salt) {
        if (err) return reject(err);
        bcrypt.hash(pass, salt, null, function(err, hash) {
            if (err) return reject(err);
            resolve(hash);
        });
    });
})

exports.doesMatch = (pass, hash) => new Promise((resolve, reject) => {
    bcrypt.compare(pass, hash, (err, result) => {
        if (err) return reject(err);
        resolve(result);
    })
})

exports.createToken = (user) => new Promise((resolve, reject) => {
    jwt.sign(user, SECRET_KEY, { expiresIn: '30m'}, (error, token) => {
        if (error) return reject(error);

        resolve(token);
    })
})

exports.verifyToken = (req, res, next) => {
    const bearer = req.headers.authorization;

    if (typeof bearer === 'undefined') {
        console.log('Token verification failed: No Bearer token!');
        return res.sendStatus(403);
    }

    const token = bearer.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (error, decoded) => {
        if (error) {
            console.log(`Token verification failed error: ${error}`);
            return res.sendStatus(403);
        }

        req.user = decoded;
        next();
    })
}
