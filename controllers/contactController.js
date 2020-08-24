const path = require('path');
const nodemailer = require('nodemailer');
const request = require('request');

// Initialize this only when running on localhost
// const process = require('./../dummyProcess.json');

// Path of views directory
const viewsPath = path.dirname(require.main.filename) + '/views/';

// Initializing necessary variables

const fromEmail = process.env.FROM_EMAIL;
const fromPassword = process.env.FROM_PASSWORD;
const toEmail = process.env.TO_EMAIL;
const secretRecaptchaKey = process.env.SECRET_RECAPTCHA_KEY;

// tranporter for email
const tranporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    secure: false,
    auth: {
        user: fromEmail,
        pass: fromPassword
    }
});

const mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: '',
    text: ''
};

exports.getContactPage = (req, res, next) => {
    res.sendFile('contact.html', { root: viewsPath });
};

exports.contactMe = (req, res, next) => {
    let gCaptchaResponse = req.body['g-recaptcha-response'];
    let validationToken = false;
    request.post({ url: 'https://www.google.com/recaptcha/api/siteverify',
        form: { secret: secretRecaptchaKey,  response: gCaptchaResponse }},
        (err, httpRes, body) => {
            if(err) {
                console.error(err);
                return;
            }
            validationToken = JSON.parse(body).success;
            if (validationToken === true && (req.body.firstName.length > 0 && req.body.lastName.length > 0 && req.body.email.length > 0 && req.body.subject.length > 0 && (req.body.message.length > 0 && req.body.message.length < 1000))) {
                mailOptions.subject = `<Website> ${ req.body.subject }`;
                mailOptions.text = `${req.body.firstName} ${req.body.lastName}[${req.body.email }] says:\n Subject: ${req.body.subject} \n Body:\n${ req.body.message }`;
                tranporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        res.render('ack_error', { errorMessage: 'Message not sent! Try again.' });
                    }
                });
                res.render('ack_contact_success');
            } else {
                res.render('ack_contact_error');
            }
            
        });
        
};