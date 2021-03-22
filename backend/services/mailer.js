const sgMail = require("@sendgrid/mail");
const Joi = require("joi");

function setKey(){
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}
setKey();
const schema = Joi.object({
    intention:Joi.string().valid('Invitation', 'F2A', 'Access Code').required(),
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

module.exports = {
  validateEmail,
  sendEmail,
  setKey
};
