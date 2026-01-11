import nodemailer from 'nodemailer';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { env } from '$env/dynamic/private';
import { setLocale, getLocale } from '$lib/paraglide/runtime';
import * as m from '$lib/paraglide/messages';

if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !env.AWS_REGION) {
  throw new Error('AWS Credentials not found in .env');
}

const ses = new SESv2Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY
  }
});

const transporter = nodemailer.createTransport({
  streamTransport: true,
  newline: 'unix',
  buffer: true
});

export async function sendVerificationEmail(email: string, token: string, locale: 'en' | 'pt-br') {
  // Temporariamente muda locale para gerar mensagens
  const originalLocale = getLocale();
  setLocale(locale);

  const baseUrl = env.ORIGIN.replace(/\/$/, '');
  const verifyUrl = `${baseUrl}/${locale}/verify-email?token=${token}`;

  const mailOptions = {
    from: env.FROM_EMAIL,
    to: email,
    subject: m.email_verify_subject(),
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>${m.email_verify_heading()}</h1>
        <p>${m.email_verify_body()}</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">
          ${m.email_verify_button()}
        </a>
        <p style="margin-top: 20px; color: #666; font-size: 12px;">
          ${m.email_verify_expires()}
        </p>
        <p style="font-size: 10px; color: #aaa;">
          ${m.email_verify_ignore()}
        </p>
      </div>
    `
  };

  // Restaura locale original
  setLocale(originalLocale);

  const info = await transporter.sendMail(mailOptions);

  const command = new SendEmailCommand({
    Content: {
      Raw: {
        Data: info.message as Buffer
      }
    }
  });

  await ses.send(command);
}