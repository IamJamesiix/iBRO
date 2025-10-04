import { sender } from "../libs/sendgrid.js"
import { createWelcomeEmailTemplate } from "./emailTemplate.js";
import User from "../models/User.js";
import config from "../libs/env.js";

export const sendWelcomeEmail = async (email, userName, clientURL) => {
  console.log('📧 Sending email to:', email);
  console.log('👤 Name:', userName);
  console.log('🔗 Client URL:', clientURL);

  if (!email) {
    throw new Error('Email is required');
  }

  // Changed from sendMail to send
  const [response] = await sender.send({
    from: config.SMTP_USER.trim(),
    to: email,
    subject: "Welcome to iBRO",
    html: createWelcomeEmailTemplate(userName, clientURL),
  });

  console.log("Message sent:", response.statusCode);
};