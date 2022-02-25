const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

//IMPORT ROUTES
const createUsers = require('./routes/createUsers');

//MIDDLEWARES

//ROUTES

app.use('/createUser', createUsers);

app.get('/', (req, res) => {
    res.send('Home');
});

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, () => {
    console.log('Connected to DB');
});

app.listen(3000);