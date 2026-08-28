import { Resend } from 'resend';

const fallbackRecaptchaSiteKey = '6Lf16-oUAAAAAF7KtpJtvu52fWCE5GVllQKLcCl5';

const getEmailConfig = () => {
    const config = {
        resendApiKey: process.env.RESEND_API_KEY,
        fromEmail: process.env.RESEND_FROM_EMAIL,
        toEmail: process.env.TO_EMAIL
    };

    if (!config.resendApiKey || !config.fromEmail || !config.toEmail) {
        throw new Error('Email configuration is incomplete.');
    }

    return config;
};

export const getContactPage = (req, res, next) => {
    const recaptchaSiteKey = process.env.RECAPTCHA_SITE_KEY || fallbackRecaptchaSiteKey;
    res.render('contact', { recaptchaSiteKey });
};

export const contactMe = async (req, res, next) => {
    const gCaptchaResponse = req.body['g-recaptcha-response'];
    const validInput =
        typeof req.body.firstName === 'string' && req.body.firstName.trim().length > 0 &&
        typeof req.body.lastName === 'string' && req.body.lastName.trim().length > 0 &&
        typeof req.body.email === 'string' && req.body.email.trim().length > 0 &&
        typeof req.body.subject === 'string' && req.body.subject.trim().length > 0 &&
        typeof req.body.message === 'string' &&
        req.body.message.trim().length > 0 &&
        req.body.message.length <= 1000;

    try {
        const secretRecaptchaKey = process.env.SECRET_RECAPTCHA_KEY;

        if (!secretRecaptchaKey) {
            return res.status(500).render('ack_error', { errorMessage: 'Captcha configuration is missing.' });
        }

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
                const { resendApiKey, fromEmail, toEmail } = getEmailConfig();
                const resend = new Resend(resendApiKey);
                const sendResult = await resend.emails.send({
                    from: fromEmail,
                    to: toEmail,
                    subject: `<Website> ${ req.body.subject }`,
                    text: `${req.body.firstName} ${req.body.lastName}[${req.body.email }] says:\n Subject: ${req.body.subject} \n Body:\n${ req.body.message }`
                });

                if (!sendResult || sendResult.error) {
                    console.error(sendResult?.error || 'Empty response from Resend');
                    return res.status(502).render('ack_error', { errorMessage: 'Message not sent! Try again.' });
                }

                return res.render('ack_contact_success');
            } catch (sendError) {
                console.error(sendError);
                return res.status(502).render('ack_error', { errorMessage: 'Message not sent! Try again.' });
            }
        }

        return res.status(400).render('ack_contact_error');
    } catch(err) {
        console.error(err);
        return res.status(502).render('ack_error', { errorMessage: 'Captcha verification failed.' });
    }
};
