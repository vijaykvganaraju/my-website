const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    auth: { 
        encryptedPass: { type: String, required: true },
        key: { type: String, required: true },
        iv: { type: String, required: true }
    },
    roles: { type: Array, required: true, default: ['viewer'] },
    tries: { type: Number, default: 3 }
});

userSchema.pre('validate', function (next) {
    let roles = this.roles;
    roles.forEach(role => {
        if(!['admin', 'viewer', 'editor'].includes(role)) {
            this.role = ['viewer'];
            return;
        }
    })
    next();
});

module.exports = mongoose.model('Users', userSchema);