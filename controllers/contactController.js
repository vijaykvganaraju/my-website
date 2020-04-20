const path = require('path');
const nodemailer = require('nodemailer');

// const process = require('./../process');

// Path of views directory
const viewsPath = path.dirname(require.main.filename) + '/views/';

// tranporter for email
const tranporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.FROM_PASSWORD
    }
});

const mailOptions = {
    from: '',
    to: process.env.TO_EMAIL,
    subject: '',
    text: ''
};

exports.getContactPage = (req, res, next) => {
    res.sendFile('contact.html', { root: viewsPath });
};

exports.contactMe = (req, res, next) => {
    if (req.body['g-recaptcha-response'].length > 0 && (req.body.firstName.length > 0 && req.body.lastName.length > 0 && req.body.email.length > 0 && req.body.subject.length > 0 && (req.body.message.length > 0 && req.body.message.length < 1000))) {
        mailOptions.from = `"${req.body.firstName} ${req.body.lastName}" <${ req.body.email }>`;
        mailOptions.subject = req.body.subject;
        mailOptions.text = req.body.message;
        tranporter.sendMail(mailOptions, err => {
            if(err) {
                res.sendFile('contact_error.html', { root: viewsPath });
            }
        });
        res.sendFile('contact_success.html', { root: viewsPath });
    } else {
        res.sendFile('contact_error.html', { root: viewsPath });
    }
};