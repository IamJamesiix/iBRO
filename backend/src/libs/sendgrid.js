import sgMail from "@sendgrid/mail";
import config from "./env.js";

sgMail.setApiKey(config.SENDGRID_API_KEY);


export const sendWelcomeEmail = async (email, userName) => {
  try {
    await sgMail.send({
      to: email,            // ← User's email from registration
      from: config.SMTP_USER.trim(),       // Your verified sender
      subject: "Welcome!",
      text: `Welcome ${userName}! Thanks for signing up.`,
    });
    console.log('✅ Welcome email sent');
  } catch (error) {
    console.log('❌ Email Error:', error.response?.body?.errors);
  }
};

export const sender = sgMail;