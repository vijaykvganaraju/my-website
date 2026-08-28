import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';

const getBasicAuthCredentials = (req) => {
    const authHeader = req.get('authorization');

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return {};
    }

    const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf8');
    const separatorIndex = decoded.indexOf(':');

    if (separatorIndex === -1) {
        return {};
    }

    return {
        username: decoded.slice(0, separatorIndex),
        password: decoded.slice(separatorIndex + 1)
    };
};

const verifyLegacyPassword = (password, auth) => {
    if (!auth?.encryptedPass || !auth?.key || !auth?.iv) {
        return false;
    }

    const cipher = crypto.createCipheriv('aes-256-gcm', auth.key, auth.iv);
    let encryptedPass = cipher.update(password, 'utf8', 'hex');
    encryptedPass += cipher.final('hex');

    return encryptedPass === auth.encryptedPass;
};

const checkAuth = async (req, res, next) => {
    try {
        const basicCredentials = getBasicAuthCredentials(req);
        const username = basicCredentials.username || req.body.username;
        const recdPass = basicCredentials.password || req.body.password;

        if (!username || !recdPass) {
            res.set('WWW-Authenticate', 'Basic realm="Blog authoring"');
            return res.status(401).render('ack_error', { errorMessage: 'Authentication required.' });
        }

        const user = await User.findOne({username: username});
        
        if(user) {
            const noOfTries = user.tries;

            if (noOfTries > 0) {
                const passwordMatches = user.auth?.passwordHash
                    ? await bcrypt.compare(recdPass, user.auth.passwordHash)
                    : verifyLegacyPassword(recdPass, user.auth);

                if (passwordMatches) {
					if(noOfTries < 3) {
						await user.updateOne({ tries: 3 });
					}
                    next();
                } else {
                    await user.updateOne({ tries: noOfTries - 1 });
                    res.status(401).render('ack_error', { errorMessage: `Username and password do not match! Only ${ noOfTries - 1 } trie(s) left.` });
                }
                
            } else {
                res.status(429).render('ack_error', { errorMessage: `Too many tries! Disabled temporarily.` });
            }
        } else {
            res.status(401).render('ack_error', { errorMessage: `Username and password do not match!` });
        }
        
    } catch(err) {
        console.error(err);
        res.status(500).render('ack_error', { errorMessage: `Authentication error` });
    }
};

export default checkAuth;
