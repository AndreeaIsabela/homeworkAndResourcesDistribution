const nodemailer = require('nodemailer');

export class MailerController {

  constructor() { }

  async sendEmail(emailContent) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'edreho@gmail.com',
        pass: 'qwert12345ASD!@#'
      }
    });

    const info = await transporter.sendMail({
      from: 'edreho96@gmail.com', // sender address
      to: emailContent.email, // list of receivers
      subject: emailContent.subject, // Subject line
      text: emailContent.grade + '\n' + emailContent.observations // plain text body
    });

    const url = nodemailer.getTestMessageUrl(info);
  }
}