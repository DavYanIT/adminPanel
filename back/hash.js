const bcrypt = require('bcrypt-nodejs');

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
