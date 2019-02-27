const express = require('express');
const bodyParser = require('body-parser');

const store = require('./store');

const app = express();
app.use(bodyParser.json());

app.post('/createUser', (req, res) => {
    const { username, password } = req.body;
    store.createUser({
        username,
        password
    }).then(() => res.sendStatus(200))
})

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    store.authenticate({
        username,
        password
    }).then(({ success }) => {
        if (success) {
            res.sendStatus(200)
        } else {
            res.sendStatus(401)
        }
    })
})

app.listen(7555, () => {
    console.log(`Server running on localhost:7555`)
})