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
                (error) ? reject(error) : resolve({ rows: rows });
            });
        });
    }
}

async function createTables() {
    await db.exe('CREATE TABLE IF NOT EXISTS config (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, value TEXT NOT NULL, core NUMERIC DEFAULT 0)');
    await db.exe('CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, password TEXT NOT NULL, email TEXT NULL, roleId INTEGER NOT NULL, FOREIGN KEY(roleId) REFERENCES role(id))');
    await db.exe('CREATE TABLE IF NOT EXISTS activity_log (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, action TEXT NOT NULL, refId INTEGER NOT NULL, refType TEXT NOT NULL, updateDate TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(userId) REFERENCES user(id))')
    await db.exe('CREATE TABLE IF NOT EXISTS role (id INTEGER PRIMARY KEY AUTOINCREMENT, roleDefinition TEXT NOT NULL)');
    resolve();
}

async function insertDefaults() {
    await db.exe('INSERT OR IGNORE INTO config(name, value, core) values("port", "8787", 1)');
    await db.exe('INSERT OR IGNORE INTO config(name, value, core) values("contextPath", "/", 1)');
    resolve();
}