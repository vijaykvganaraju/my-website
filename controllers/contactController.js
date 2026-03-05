import { Resend } from 'resend';

// Initializing necessary variables

const resendApiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL;
const toEmail = process.env.TO_EMAIL;
const secretRecaptchaKey = process.env.SECRET_RECAPTCHA_KEY;
const resend = new Resend(resendApiKey);

export const getContactPage = (req, res, next) => {
    res.render('contact');
};

export const contactMe = async (req, res, next) => {
    let gCaptchaResponse = req.body['g-recaptcha-response'];
    const validInput =
        typeof req.body.firstName === 'string' && req.body.firstName.trim().length > 0 &&
        typeof req.body.lastName === 'string' && req.body.lastName.trim().length > 0 &&
        typeof req.body.email === 'string' && req.body.email.trim().length > 0 &&
        typeof req.body.subject === 'string' && req.body.subject.trim().length > 0 &&
        typeof req.body.message === 'string' &&
        req.body.message.trim().length > 0 &&
        req.body.message.length <= 1000;

    try {
        const captchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                secret: secretRecaptchaKey,
                response: gCaptchaResponse
            })
        });

        const captchaData = await captchaResponse.json();
        const validationToken = captchaData.success === true;

        if (validationToken && validInput) {
            try {
                await resend.emails.send({
                    from: fromEmail,
                    to: toEmail,
                    subject: `<Website> ${ req.body.subject }`,
                    text: `${req.body.firstName} ${req.body.lastName}[${req.body.email }] says:\n Subject: ${req.body.subject} \n Body:\n${ req.body.message }`
                });
                return res.render('ack_contact_success');
            } catch (sendError) {
                console.error(sendError);
                return res.render('ack_error', { errorMessage: 'Message not sent! Try again.' });
            }
        }

        return res.render('ack_contact_error');
    } catch(err) {
        console.error(err);
        return res.render('ack_error', { errorMessage: 'Captcha verification failed.' });
    }
};
