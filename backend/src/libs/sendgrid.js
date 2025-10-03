import sgMail from "@sendgrid/mail";
import config from "./env.js";

sgMail.setApiKey(config.SENDGRID_API_KEY);

// Verify setup (optional)
sgMail
  .send({
    to: config.SMTP_USER, // Send test to yourself
    from: config.SMTP_USER, // Must be verified in SendGrid
    subject: "SendGrid Test",
    text: "If you receive this, SendGrid is configured correctly!",
  })
  .then(() => console.log('✅ SendGrid is ready to send emails'))
  .catch((error) => console.log('❌ SendGrid Error:', error.message));

export const sender = sgMail;