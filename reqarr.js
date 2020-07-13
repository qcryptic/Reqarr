const express = require('express');
const db = require('./modules/database');
const dir = require('os').homedir() + '/reqarr';
const path = require("path");
const fs = require('fs');
const bodyParser = require('body-parser');
const routes = require('./modules/routes');
const reqarr = express();

(async () => {
    // Create config directory if it doesn't exist yet
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log('Reqarr config directory created at "~/reqarr"');
    }

    // Connect to database (create if it doesn't exist)
    await db.init().catch((err) => { console.log(err); process.exit(1); });
    console.log('Connected to the reqarr database');

    // Get config items necessary for app start
    let config = await db.getCoreConfig().catch((err) => { console.log(err); process.exit(1) });

    // Add body parsers
    reqarr.use(bodyParser.json());
    reqarr.use(bodyParser.urlencoded({ extended: true }));

    // Serve static frontend vue files
    reqarr.use(config.contextPath, express.static(path.join(__dirname, 'public')));

    // Add routes
    reqarr.use(config.contextPath, routes);

    // Start reqarr
    reqarr.listen(config.port, () => console.log(`Reqarr is running on port ${config.port} with context-path '${config.contextPath}'`));
})();