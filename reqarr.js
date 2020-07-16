const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const db = require('./src/modules/database');
const home = require('os').homedir() + '/reqarr';
const path = require("path");
const fs = require('fs');
const bodyParser = require('body-parser');
const history = require('connect-history-api-fallback');
const reqarr = express();

(async () => {
    // Create config directory if it doesn't exist yet
    if (!fs.existsSync(home)) {
        fs.mkdirSync(home);
        console.log('Reqarr config directory created at "~/reqarr"');
    }

    // Connect to database (create if it doesn't exist)
    await db.init().catch((err) => { console.log(err); process.exit(1); });
    console.log('Connected to the reqarr database');

    // Get config items necessary for app start
    let config = await db.getCoreConfig().catch((err) => { console.log(err); process.exit(1) });

    // Add session
    reqarr.use(session({
        resave: true,
        saveUninitialized: false,
        store: new SQLiteStore({dir: home}),
        secret: config.sessionPass,
        cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
    }));

    // Add body parsers
    reqarr.use(bodyParser.json());
    reqarr.use(bodyParser.urlencoded({ extended: true }));

    // Handle security, if not logged in redirect to login page. Allow register page. Allow static resources.
    reqarr.use(function (req, res, next) {
        let original = req.originalUrl;
        if (original.startsWith('/js') || original.startsWith('/css') || original === '/favicon.ico') 
            next();
        else {
            if (!req.session.role && !original.startsWith('/login') && !original.startsWith('/register')) 
                res.redirect(config.contextPath + '/login');
            else
                next();
        }
    });

    // History api fallback
    reqarr.use(history());

    // Add routes
    reqarr.use(config.contextPath, require('./src/routes/routes'));

    // Serve static frontend vue files
    reqarr.use(config.contextPath, express.static(path.join(__dirname, 'public')));

    // Start reqarr
    reqarr.listen(config.port, () => console.log(`Reqarr is running on port ${config.port} with context-path '${config.contextPath}'`));
})();