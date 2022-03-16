const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator'); 

const userSchema = mongoose.Schema({
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
module.exports = mongoose.model('Users', userSchema);