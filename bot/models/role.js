const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    roleId: {
        type: String,
        required: true,
    },
    roleName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
