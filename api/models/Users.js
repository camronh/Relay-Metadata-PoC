const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator'); 

const userSchema = mongoose.Schema({ //noSQL schema, easier than SQL; it describes the way your data looks
    name: {
        type: String,
        required: true
    },
    ethAddress: {
        type: String,
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: true
    }
});
userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Users', userSchema); //give it name and schema to use