const { Client } = require('pg'),
    configs = require('./configs');

const client = new Client(configs.client);

async function init() {
    try {
        await client.connect();
        console.log('Client connected!');
        try {
            await client.query(`
                CREATE DATABASE adminpanel;
            `);
            console.log('Created adminpanel database');
        } catch (err) {
            console.log(`Create adminpanel database --- ${err}`);
        }
        await client.query('BEGIN');
        await client.query(`
            CREATE TABLE users (
                nickname varchar(50) NOT NULL UNIQUE,
                password varchar(500) NOT NULL,
                role varchar(10) NOT NULL DEFAULT '${configs.userRoles.DEVELOPER}'
            );
        `);
        console.log('Created users table');
        await client.query(`
            CREATE TABLE reports (
                name varchar(50) NOT NULL,
                description varchar(500) NOT NULL,
                estimation varchar(50) NOT NULL,
                spent varchar(500) NOT NULL,
                assignee varchar(10) NOT NULL
            );
        `);
        console.log('Created reports table');
        const { nickname, password, role } = configs.DEFAULT_ADMIN
        await client.query(`
            INSERT INTO users (nickname, password, role) VALUES
                ('${nickname}', '${password}', '${role}');
        `);
        console.log('Inserted default admin');
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.log(`Something went wrong ${err}`);
    } finally {
        await client.end();
        console.log('Client connection ended!');
    }
}

init();
