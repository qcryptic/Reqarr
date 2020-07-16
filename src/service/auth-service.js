const db = require('../modules/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    register: async function (req, res) {
        var { username, password, key } = req.body;

        // Input validation
        response = registerValidation(username, password, key);
        if (response.error) {
            res.send(response.message);
            return;
        }

        // Retrieve key details
        const keyInfo = await db.getRegistrationKey(key).catch((err) => { res.status(500); res.send(); });
        if (keyInfo.rows.length !== 1) {
            res.send('Key not found');
            return;
        } 
        else {
            let key = keyInfo.rows[0];
            if (key.isValid === 0 || (new Date().getTime() > key.expiration)) {
                let err = (key.isValid === 0) ? 'Key expired' : 'Key invalidated';
                res.send(err);
                return;
            }
        }

        // Save user (encrypted pass)
        await db.saveUser(username, bcrypt.hashSync(password, saltRounds), keyInfo.rows[0].roleId);
        res.send('ok');
    },

    login: async function (req, res) {
        var { username, password } = req.body;
        try {
            const user = await db.getUser(username);
            if (user.rows.length === 1) {
                if (bcrypt.compareSync(password, user.rows[0].password)) {
                    let role = await db.getRoleById(user.rows[0].roleId);
                    req.session.role = JSON.parse(role.rows[0].definition);
                    res.send('ok');
                    return;
                }
            }
            res.send('Invalid username or password');
            return;
        }
        catch (err) {
            console.log('Error retrieving user for login: '+err);
        }
        res.status(500);
        res.send('Server error, try again later');
    }
}

function registerValidation(username, password, key) {
    let response = { error: false, message: '' };
    let userRegEx = new RegExp("^([a-zA-Z0-9]{2,30})$");
    let passRegEx = new RegExp("^(.{1,64})$");
    let keyRegEx = new RegExp("^([a-z0-9]{32})$");
    if (!userRegEx.test(username)) {
        response.error = true;
        response.message = "Invalid username";
    }
    else if (!passRegEx.test(password)) {
        response.error = true;
        response.message = "Invalid password";
    }
    else if (!keyRegEx.test(key)) {
        response.error = true;
        response.message = "Invalid key";
    }
    return response;
}