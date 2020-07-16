const sqlite3 = require('sqlite3').verbose();
const database = require('os').homedir() + '/reqarr/reqarr.db';
const { resolve } = require('path');

var db;

module.exports = {

    init: async function() {
        try {
            db = new sqlite3.Database(database, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => { if (err) throw err });
            addAsyncFunctions();
            await createTables();
            await insertDefaults();
        } catch (err) {
            console.log(err);
            throw new Error('Fatal: Unable to initialize database');
        }
    },

    getCoreConfig: async function () {
        var config = {}
        const response = await db.query('SELECT * FROM config WHERE core = 1', [])
            .catch((err) => {
                console.log(err); 
                throw new Error('Error reading core config from database'); 
            });
        response.rows.forEach((row) => { config[row.name] = row.value; })
        return config;
    },

    updateConfig: function (name, value, core) {
        let isCore = (core) ? 1 : 0;
        let insertConfig = 'INSERT OR REPLACE INTO config(name, value, core) values(?, ?, ?)';
        db.exe(insertConfig, [name, value, isCore]);
    },

    saveUser: function (name, pass, role) {
        db.exe('INSERT INTO user(username, password, roleId) values(?, ?, ?)', [name, pass, role]);
    },

    getUser: function (username) {
        return db.query('SELECT * FROM user WHERE username=?', [username]);
    },

    getRoleById: function (roleId) {
        return db.query('SELECT * FROM role WHERE id=?', [roleId]);
    },

    getRoleByName: function (roleName) {
        return db.query('SELECT * FROM role WHERE name=?', [roleName]);
    },

    getRegistrationKey: function (key) {
        return db.query('SELECT * FROM registration_key WHERE key=?', [key]);
    },

    generateRegistrationKey: async function (roleName) {
        let key = generateKey();
        let expiration = Date.now() + 43200000;
        let isValid = 1;
        let roleResult = await this.getRoleByName(roleName);
        if (roleResult.rows.length === 1) {
            let insert = 'INSERT INTO registration_key(key, expiration, isValid, roleId) values(?, ?, ?, ?)';
            db.exe(insert, [key, expiration, isValid, roleResult.rows[0].id]);
            return key;
        }
        else {
            return '';
        }
    }

}

function addAsyncFunctions() {
    db.query = function (sql, params) {
        var that = this;
        return new Promise(function (resolve, reject) {
            that.all(sql, params, function (error, rows) {
                (error) ? reject(error) : resolve({ rows: rows });
            });
        });
    };
    db.exe = function (sql, params) {
        var that = this;
        return new Promise(function (resolve, reject) {
            that.run(sql, params, function (error, rows) {
                (error) ? reject(error) : resolve(true);
            });
        });
    }
}

async function createTables() {
    await db.exe('CREATE TABLE IF NOT EXISTS config (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, value TEXT NOT NULL, core NUMERIC DEFAULT 0)');
    await db.exe('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, email TEXT NULL DEFAULT none, roleId INTEGER NOT NULL, FOREIGN KEY(roleId) REFERENCES role(id))');
    await db.exe('CREATE TABLE IF NOT EXISTS activity_log (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, action TEXT NOT NULL, refId INTEGER NOT NULL, refType TEXT NOT NULL, updateDate TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(userId) REFERENCES user(id))')
    await db.exe('CREATE TABLE IF NOT EXISTS role (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, definition TEXT NOT NULL)');
    await db.exe('CREATE TABLE IF NOT EXISTS registration_key (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT NOT NULL, expiration NUMERIC NOT NULL, isValid NUMERIC DEFAULT 0, roleId INTEGER NOT NULL, FOREIGN KEY(roleId) REFERENCES role(id))');
    resolve();
}

async function insertDefaults() {
    let admin = { 'admin': true };
    await db.exe('INSERT OR IGNORE INTO config(name, value, core) values("port", "8787", 1)');
    await db.exe('INSERT OR IGNORE INTO config(name, value, core) values("contextPath", "/", 1)');
    await db.exe('INSERT OR IGNORE INTO config(name, value, core) values("session", ?, 1)', [generateKey()]);
    await db.exe('INSERT OR IGNORE INTO role(name, definition) values("admin", ?)', [JSON.stringify(admin)]);
    resolve();
}

function generateKey() {
    for(var key = ''; key.length < 32;) 
        key += Math.random().toString(36).substr(2, 1);
    return key;    
}