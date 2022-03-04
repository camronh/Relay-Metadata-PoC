const mongoose = require('mongoose');

const userSchema = mongoose.Schema({ //noSQL schema, easier than SQL; it describes the way your data looks
    name: {
        type: String,
        required: true
    },
    ethAddress: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Users', userSchema); //give it name and schema to use