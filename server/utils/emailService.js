const sendEmail = async ({ to, subject, text, html }) => {
  // Structure ready for Nodemailer or SendGrid
  // E.g.,
  // const nodemailer = require('nodemailer');
  // const transporter = nodemailer.createTransport({ ... });
  // await transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, text, html });

  if (process.env.NODE_ENV !== 'production' || !process.env.EMAIL_API_KEY) {
    console.log(`[Email Service Mock] Sending email to: ${to}`);
    console.log(`[Email Service Mock] Subject: ${subject}`);
    console.log(`[Email Service Mock] Body: ${text || html}`);
    return true;
  }

  // Placeholder for real production code
  throw new Error('Email service not fully configured with real keys yet.');
};

module.exports = {
  sendEmail,
};
