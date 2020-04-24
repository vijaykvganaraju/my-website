const mongoose = require('mongoose');
const crypto = require('crypto');

const User = require('./../models/userModel');

exports.getUsers = async (req, res, next) => {
    try {
        const users  = await User
            .find()
            .select('username');
        if(users.length > 0) {
            res.status(200).json({
                'Users': users
            });
        } else {
            throw('No users found!');
        }
    } catch(err) {
        console.error(err);
        res.status(404).json({
            error: err
        })
    }
};

exports.createUser = async (req, res, next) => {
    let user = {
        _id: new mongoose.Types.ObjectId,
        username: '',
        password: '',
        auth:  { encryptedPass: '', key: '', iv: '' },
        roles: []
    };

    let username = req.body.username;
    let password = req.body.password;
    let rolesString = req.body.roles;
    let rolesArray = rolesString.split(',');
    rolesArray = rolesArray.map(role => role.trim());
    if(username.length >= 4 && password.length >= 8) {
        let iv = crypto.randomBytes(4).toString('hex');
        const key = crypto.randomBytes(16).toString('hex');
        
        let cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
        let encryptedPass = cipher.update(password, 'utf8', 'hex');
        encryptedPass += cipher.final('hex')
    
        
        user.username = username;
        user.auth.encryptedPass = encryptedPass;
        user.auth.key = key;
        user.auth.iv = iv;
        user.roles = rolesArray;
        
        try {
            let userObject = new User(user);
            await userObject.save();
            res.status(200).json({
                message: 'User created',
                user: user.username
            });
        } catch(err) {
            console.error(err);
            res.status(500).json({
                error: err
            });
        }

    }

};