const MSG91 = require("msg91")("YOUR_AUTH_KEY", "SENDER_ID", "ROUTE_NO");

/**
 * Send SMS via MSG91
 * @param {string} phone - Recipient phone number
 * @param {string} message - Message to send
 */
const sendSMSMsg91 = async (phone: string, message: string) => {
  try {
    await MSG91.send(phone, message);
    console.log(`SMS sent to ${phone}`);
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};

export default sendSMSMsg91;



// module.exports = { sendSMS: sendSMSMsg91 };
