
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const nodemailer = require('nodemailer');

const sendRecoveryEmail = (user) => {
  const isEmailSent = false;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: `${process.env.EMAIL_ADDRESS}`,
      pass: `${process.env.EMAIL_PASSWORD}`,
    },
  });

  const mailOptions = {
    from: `${process.env.EMAIL_ADDRESS}`,
    to: `${user.email}`,
    subject: 'Link To Reset Password',
    text:
      'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
      + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
      + `http://localhost:3031/reset/${user.resetPasswordToken}\n\n`
      + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
  };

  console.log('sending mail');

  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      console.log(err);
    } else {
      console.log(response);
      isEmailSent = true;
    }
    return isEmailSent;
  });
}

module.exports = {
  sendRecoveryEmail,
}