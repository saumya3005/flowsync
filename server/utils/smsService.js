const sendSMS = async ({ to, body }) => {
  // Structure ready for Twilio
  // E.g.,
  // const twilio = require('twilio');
  // const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  // await client.messages.create({ body, from: process.env.TWILIO_PHONE_NUMBER, to });

  if (process.env.NODE_ENV !== 'production' || !process.env.TWILIO_SID) {
    console.log(`[SMS Service Mock] Sending SMS to: ${to}`);
    console.log(`[SMS Service Mock] Body: ${body}`);
    return true;
  }

  // Placeholder for real production code
  throw new Error('SMS service not fully configured with real keys yet.');
};

module.exports = {
  sendSMS,
};
