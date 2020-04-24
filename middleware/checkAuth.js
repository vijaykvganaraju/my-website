const crypto = require('crypto');
const User = require('./../models/userModel');

module.exports  = async (req, res, next) => {
    try {
        let username = req.body.username;
        const user = await User.findOne({username: username});
        
        if(user) {
            const recdPass = req.body.password;
            const noOfTries = parseInt(user.tries);

            if (noOfTries > 0) {
                const cipher = crypto.createCipheriv('aes-256-gcm', user.auth.key, user.auth.iv);
                let encryptedRecdPass = cipher.update(recdPass, 'utf8', 'hex');
                encryptedRecdPass += cipher.final('hex');
        
                if (encryptedRecdPass === user.auth.encryptedPass) {
                    next();
                } else {
                    await user.updateOne({ tries: noOfTries - 1 });
                    res.render('ack_error', { errorMessage: `Username and password do not match! Only ${ noOfTries - 1 } trie(s) left.` });
                }
                
            } else {
                res.render('ack_error', { errorMessage: `Too many tries! Disabled temporarily.` });
            }
        } else {
            res.render('ack_error', { errorMessage: `Username and password do not match!` });
        }
        
    } catch(err) {
        console.error(err);
        res.render('ack_error', { errorMessage: `Authentication error` });
    }
};