// utils/emailSender.js
const nodemailer = require('nodemailer');
const { emailService, emailUser, emailPass } = require('../config/config');

const transporter = nodemailer.createTransport({
  service: emailService,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: emailUser,
      to,
      subject,
      text,
    });
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

module.exports = sendEmail;
