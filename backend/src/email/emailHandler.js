import { sender } from "../libs/nodemailer.js";
import { createWelcomeEmailTemplate } from "./emailTemplate.js";
import User from "../models/User.js";
import config from "../libs/env.js";

export const sendWelcomeEmail = async ( email, userName, clientURL ) => {
    console.log('📧 Sending email to:', email);
    console.log('👤 Name:', userName);
    console.log('🔗 Client URL:', clientURL);

    if (!email) {
    throw new Error('Email is required');
  }

  const info = await sender.sendMail({
    from: '"IBRO" <ibroverify@gmail.com>',
    to: email,
    subject: "Welcome to iBRO",
    html: createWelcomeEmailTemplate( userName, clientURL), // HTML body
  });

  console.log("Message sent:", info.messageId);
};