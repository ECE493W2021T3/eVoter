const sgMail = require("@sendgrid/mail");
const Joi = require("joi");

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
            <p>Please use the following one-time passcode to complete your login process:</p>
            <h2>${otp}</h2>
            <br/>`
  };

  return sendEmail(msg);
}

module.exports = {
  validateEmail,
  sendEmail,
  setKey,
  sendOTPEmail
};
