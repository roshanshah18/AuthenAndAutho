import { enviroment } from '../config/enviroment';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: enviroment.EMAIL_USER,
    pass: enviroment.EMAIL_PASS,
  },
});

// Optional: verify SMTP connection at startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email server connection error:', error);
  } else {
    console.log('Nodemailer ready to send emails.');
  }
});

export const sendEmailByNodemailer = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    if (!to || typeof to !== 'string') {
      throw new Error('Recipient email address is required');
    }

    const mailOptions = {
      from: enviroment.EMAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};
