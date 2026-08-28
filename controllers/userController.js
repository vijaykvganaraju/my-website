import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import User from '../models/userModel.js';

export const getUsers = async (req, res, next) => {
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

export const createUser = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const rolesString = req.body.roles || 'viewer';
    const rolesArray = rolesString.split(',').map(role => role.trim()).filter(Boolean);

    if (!username || username.length < 4 || !password || password.length < 8) {
        return res.status(400).json({
            error: 'Username must be at least 4 characters and password must be at least 8 characters.'
        });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 12);
        const userObject = new User({
            _id: new mongoose.Types.ObjectId(),
            username,
            auth: { passwordHash },
            roles: rolesArray.length > 0 ? rolesArray : ['viewer']
        });

        await userObject.save();
        res.status(201).json({
            message: 'User created',
            user: username
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            error: err
        });
    }
};
