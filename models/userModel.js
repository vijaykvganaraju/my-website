import mongoose from 'mongoose';


const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    auth: {
        passwordHash: { type: String },
        encryptedPass: { type: String },
        key: { type: String },
        iv: { type: String }
    },
    roles: { type: Array, required: true, default: ['viewer'] },
    tries: { type: Number, default: 3 }
});

userSchema.pre('validate', function () {
    if (!this.auth || (!this.auth.passwordHash && !this.auth.encryptedPass)) {
        this.invalidate('auth', 'A password hash is required.');
    }

    let roles = this.roles;
    roles.forEach(role => {
        if(!['admin', 'viewer', 'editor'].includes(role)) {
            this.roles = ['viewer'];
            return;
        }
    })
});

export default mongoose.model('Users', userSchema);
