const { Client } = require('pg'),
    { encrypt, doesMatch } = require('./hash'),
    express = require("express"),
    app = express(),
    configs = require('./configs');

app.post("/user", async (req, res) => {
    const client = new Client(configs.client);
    // TODO: check admin role and for god sake check the login
    const { nickname, password, role } = req.body
    try {
        const encryptedPass = await encrypt(password)
        await client.connect();
        console.log('Client connected!');
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                nickname varchar(50) NOT NULL,
                password varchar(500) NOT NULL,
                role varchar(10) NOT NULL DEFAULT ${configs.userRoles.DEVELOPER}
            );
        `);
        console.log('Created users table');
        await client.query(`
            INSERT INTO users (nickname, password, role) VALUES
                ('${nickname}', '${encryptedPass}', '${role}');
        `);
        res.statusCode = 200;
    } catch (err) {
        res.statusCode = 500;
        console.log(`Something went wrong ${err}`);
    } finally {
        await client.end();
        console.log('Client connection ended!');
        res.json();
    }
})

app.post("/login", async (req, res) => {
    const client = new Client(configs.client);
    const { nickname, password } = req.body;
    let user;

    try {
        await client.connect();
        const result = await client.query(`
            SELECT * FROM users
            WHERE nickname = '${nickname}';
        `);
        user = result.rows[0]
        if (!user) {
            res.statusCode = 401;
            res.statusMessage = 'Wrong nickname!';
            console.log(`Wrong nickname '${nickname}'!`);
        } else if (!(await doesMatch(password, user.password))) {
            res.statusCode = 401;
            res.statusMessage = 'Wrong password!';
            console.log(`Wrong password '${password}'!`);
        } else {
            res.statusCode = 200;
            console.log(`User '${user.nickname}' logged in.`);
        }
    } catch(err) {
        res.statusCode = 500;
        console.log(`Something went wrong ${err}`);
    } finally {
        delete user.password;
        res.json({ user });
        client.end();
    }
})

module.exports = app;
