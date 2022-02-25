const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ethAddress: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Users', userSchema);