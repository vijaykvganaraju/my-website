const path = require('path');
const nodemailer = require('nodemailer');

// Path of views directory
const viewsPath = path.dirname(require.main.filename) + '/views/';

// tranporter for email
const tranporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
});

const mailOptions = {
    from: '',
    to: '',
    subject: '',
    text: ''
};

exports.getContactPage = (req, res, next) => {
    res.sendFile('contact.html', { root: viewsPath });
};

exports.contactMe = (req, res, next) => {
    if (req.body['g-recaptcha-response'].length > 0) {
        res.sendFile('contact_success.html', { root: viewsPath });
    } else {
        res.sendFile('contact_error.html', { root: viewsPath });
    }
};