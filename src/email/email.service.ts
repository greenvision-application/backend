import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { sendEmailDto } from './dto/email.dto';
import keys from 'constants/keys';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  emailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>(keys.emailHost),
      port: this.configService.get<number>(keys.emailPort),
      secure: false,
      auth: {
        user: this.configService.get<string>(keys.emailUser),
        pass: this.configService.get<string>(keys.emailPassword),
      },
    });

    return transporter;
  }

  async sendEmail(dto: sendEmailDto) {
    const { recipients, subject, html } = dto;

    const transport = this.emailTransport();

    const options: nodemailer.SendMailOptions = {
      from: this.configService.get<string>(keys.emailUser),
      to: recipients,
      subject: subject,
      html: html,
    };
    try {
      await transport.sendMail(options);
      console.log('Email sent successfully');
    } catch (error) {
      console.log('Error sending mail: ', error);
    }
  }

  async sendOTP(email: string, otp: string) {
    const htmlContent = `<p>Mã OTP của bạn là: <strong>${otp}</strong>. Mã có hiệu lực trong 5 phút.</p>`;
    await this.sendEmail({
      recipients: [email],
      subject: 'Mã OTP xác thực',
      html: htmlContent,
    });
  }
}
