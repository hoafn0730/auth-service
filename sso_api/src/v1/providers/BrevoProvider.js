const brevo = require('@getbrevo/brevo');

const apiInstance = new brevo.TransactionalEmailsApi();
const apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const sendEmail = (email, subject, htmlContent) => {
    let sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = { name: process.env.ADMIN_EMAIL_NAME, email: process.env.ADMIN_EMAIL_ADDRESS };
    sendSmtpEmail.to = [{ email: email }];

    // sendSmtpEmail.replyTo = { email: 'shubham.upadhyay@sendinblue.com', name: 'Shubham Upadhyay' };
    // sendSmtpEmail.headers = { 'Some-Custom-Name': 'unique-id-1234' };
    // sendSmtpEmail.params = { parameter: 'My param value', subject: 'common subject' };

    return apiInstance.sendTransacEmail(sendSmtpEmail);
};

const BrevoProvider = { sendEmail };

module.exports = BrevoProvider;
