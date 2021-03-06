const sgMail = require("@sendgrid/mail");
const Joi = require("joi");
const config = require('config');

function setKey(){
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}
setKey();
const schema = Joi.object({
    intention:Joi.string().valid('Invitation', '2FA', 'Access Code').required(),
    to: Joi.string().email().required(),
    from: Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().required(),
    }),
    subject: Joi.string().required(),
    text: Joi.string().required(),
    html: Joi.string().required(),
});

function validateEmail(email) {
  return schema.validate(email);
}

function sendEmail(email) {

  result = validateEmail(email);
  if (result.error) {
    console.log(`Failed to send email: ${result.error.message}`);
    return false;
  }

  sgMail.send(email)
    .then(() => {
      console.log(`${email.intention} sent to ${email.to}`);
    })
    .catch((error) => {
      console.error(error);
    });
  return true;
}

function sendRegistrationConfirmationEmail(receiverEmail, receiverName, receiverConfirmationCode) {
  const msg = {
    intention:"Invitation",
    to: receiverEmail,
    from: {
      email: "noreply.evoter@gmail.com",
      name: "eVoter Support",
    },
    subject: `eVoter - Registration Confirmation for ${receiverName}`,
    text: "using html", // using HTML instead of text, but text cannot be empty
    html: `<h1>eVoter - Registration Confirmation for ${receiverName}</h1>
            <h2>Hello ${receiverName},</h2>
            <p>Thank you for registration. Please confirm your email by clicking on the following link:</p>
            <a href=${config.get('angular_server')}login/${receiverConfirmationCode}> Click here</a>
            </div>`,
  };

  return sendEmail(msg);
}

function sendRegistrationInvitationEmail(receiverEmail) {
  const msg = {
    intention:"Invitation",
    to: receiverEmail,
    from: {
      email: "noreply.evoter@gmail.com",
      name: "eVoter Support",
    },
    subject: `eVoter - Invitation to Sign Up eVoter`,
    text: "using html", // using HTML instead of text, but text cannot be empty
    html: `<h1>eVoter - Invitation to Sign Up eVoter</h1>
            <h2>Hello,</h2>
            <p>You have been invited to sign up for an account on eVoter. Please sign up now!</p>
            <a href=${config.get('angular_server')}signup> Click here</a>
            </div>`,
  };
  return sendEmail(msg);
}

function sendPollAssignmentEmail(userEmail, userName, pollTitle, pollType) {
  const msg = {
    intention:"Invitation",
    to: userEmail,
    from: {
      email: "noreply.evoter@gmail.com",
      name: "eVoter Support",
    },
    subject: `eVoter - You are assigned to the ${pollType} "${pollTitle}"`,
    text: "using html", // using HTML instead of text, but text cannot be empty
    html: `<h1>eVoter - You are assigned to the ${pollType} "${pollTitle}"</h1>
            <h2>Hello ${userName},</h2>
            <p>You are invited to the ${pollType}: "${pollTitle}" on eVoter. Please respond at the link below!</p>
            <a href=${config.get('angular_server')}invited-polls> Click here</a>
            </div>`,
  };
  return sendEmail(msg);
}

function sendOTPEmail(userEmail, userName, otp) {
  const msg = {
    intention:"2FA",
    to: userEmail,
    from: {
      email: "noreply.evoter@gmail.com",
      name: "eVoter Support",
    },
    subject: `eVoter - One-Time Passcode for Two-Factor Authentication`,
    text: "using html", // using HTML instead of text, but text cannot be empty
    html: `<h1>eVoter - One-Time Passcode</h1>
            <h2>Hello ${userName},</h2>
            <p>Please use the following one-time passcode to complete your login process. The code expires in 5 minutes:</p>
            <h2>${otp}</h2>
            <br/>`
  };
  return sendEmail(msg);
}

module.exports = {
  validateEmail,
  sendEmail,
  setKey,
  sendRegistrationConfirmationEmail,
  sendRegistrationInvitationEmail,
  sendPollAssignmentEmail,
  sendOTPEmail
};
