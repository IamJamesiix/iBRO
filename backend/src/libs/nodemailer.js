import nodemailer from "nodemailer"
import config from "./env.js";

export const sender = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // true for 465, false for other ports
 service: 'gmail',  
auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASSWORD,
  },
});

sender.verify((error, success) => {
  if (error) {
    console.log('SMTP Error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});