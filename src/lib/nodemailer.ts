import nodemailer from 'nodemailer';

const ENVIRONMENTS = {
  GMAIL_USER: process.env.GMAIL_USER || '',
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD || '',
};

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: ENVIRONMENTS.GMAIL_USER,
    pass: ENVIRONMENTS.GMAIL_APP_PASSWORD,
  },
});

export default transporter;
