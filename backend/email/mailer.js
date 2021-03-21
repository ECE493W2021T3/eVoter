// Boilerplate code for sending email

const sgMail = require('@sendgrid/mail')

// Run 'source config.env' in root directory to enable custom environment variables.
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
    to: '', // Change to your recipient
    from: {
        email: 'noreply.evoter@gmail.com',
        name: 'eVoter Support'
    },
    subject: 'Sending with SendGrid Test', // Change to your subject
    text: 'Hello from eVoter Node.js app',  // Body of email could be either text or html
    html: '<strong>Hello from eVoter Node.js app</strong>',
}

sgMail
    .send(msg)
    .then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })