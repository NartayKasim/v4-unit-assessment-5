// FRAMEWORKS, LIBRARIES, MODULES:
const
    express = require('express'),
    massive = require('massive'),
    session = require('express-session')

// CONTROLLERS:
const
    userCtrl = require('./controllers/user'),
    postCtrl = require('./controllers/posts')

const app = express();
app.use(express.json());

require('dotenv').config();
const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;

massive({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
})
    .then(db => {
        app.set('db', db);
        console.log('>      DATABASE:', "\x1b[32m", '   CONNECTED    ', "\x1b[0m", '<\n',);
    })
    .catch(error => console.log("\x1b[31m", error, "\x1b[0m"));

app.use(
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365
        }
    })
)

// AUTHENTICATION:
app.get('/api/auth/me', userCtrl.getUser);
app.post('/api/auth/register', userCtrl.register);
app.post('/api/auth/login', userCtrl.login);
app.post('/api/auth/logout', userCtrl.logout);

// POSTS:
app.get('/api/posts', postCtrl.readPosts);
app.post('/api/post', postCtrl.createPost);
app.get('/api/post/:id', postCtrl.readPost);
app.delete('/api/post/:id', postCtrl.deletePost)

app.listen(SERVER_PORT, () => console.log(`\n>      SERVER PORT:`, "\x1b[32m", `${SERVER_PORT}       `, "\x1b[0m", `  <`,));