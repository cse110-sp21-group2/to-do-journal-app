/* eslint-disable no-console */
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transport = {
  service: 'gmail',
  auth: {
    user: process.env.SMTP_FROM_EMAIL,
    pass: process.env.STMP_FROM_PASSWORD,
  },
};

export default class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport(transport);
    this.transporter.verify((err) => {
      if (err) {
        console.log('Error setting up Email Service: ', err);
      }
    });
  }

  /**
   * Sends an email.
   * @param {object} emailOptions - Content to send message
   * @returns {object} Success status
   */
  async sendMessage(mailOptions) {
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send message',
      };
    }

    return {
      success: true,
      message: 'We\'ve emailed you a reset link'
    };
  }
}
