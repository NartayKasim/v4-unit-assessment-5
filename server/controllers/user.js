const bcrypt = require('bcryptjs');

module.exports = {
    getUser: (req, res) => {
        if (!req.session.user) {
            return res.status(404).send(req.session.user)
        }
        res.status(200).send(req.session.user)
    },

    register: async (req, res) => {
        const { username, password, profile_pic } = req.body;

        const db = req.app.get('db');
        const dbCheck = await db.user.find_user_by_username([username]);
        const usernameExists = dbCheck[0];

        if (usernameExists) {
            return res.status(400).send('This username is taken.')
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const registerUser = await db.user.create_user([username, hash, profile_pic]);
        const user = registerUser[0];
        req.session.user = {
            username: user.username,
            id: user.id,
            profile_pic: user.profile_pic
        }
        return res.status(201).send(req.session.user);
    },

    login: async (req, res) => {
        const { username, password } = req.body;

        const db = req.app.get('db');
        const findUser = await db.user.find_user_by_username([username]);
        const user = findUser[0];
        console.log(user)

        if (!user) {
            return res.status(401).send('Username or password not found.')
        }

        const isAuthenticated = bcrypt.compareSync(password, user.password);
        console.log(isAuthenticated)
        if (!isAuthenticated) {
            return res.status(401).send('Username or password not found')
        }

        req.session.user = {
            id: user.id,
            username: user.username,
            profile_pic: user.profile_pic
        };
        res.status(200).send(req.session.user);
    },

    logout: (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    }
}