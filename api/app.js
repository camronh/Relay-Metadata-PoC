const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

//IMPORT ROUTES
const createUsers = require('./routes/createUsers');
const getUsers = require('./routes/getUser');
//MIDDLEWARES

//ROUTES

app.use('/createUser', createUsers);

app.use('/getUser', getUsers);

// ===========================
// Please keep all of the endpoints in the main app.js file.
// 
// app.get('/createUser', (req, res) => {
//     ...
// });
// ===========================

//Connect to DB
mongoose.connect(process.env.DB_CONNECT, () => {
    console.log('Connected to DB');
});

app.listen(3000);