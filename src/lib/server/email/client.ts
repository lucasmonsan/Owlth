import nodemailer from 'nodemailer';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { env } from '$env/dynamic/private';

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

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = env.ORIGIN.replace(/\/$/, '');
  const verifyUrl = `${baseUrl}/verify-email?token=${token}`;

  const mailOptions = {
    from: env.FROM_EMAIL,
    to: email,
    subject: 'Verifique sua conta',
    html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1>Verificação de Segurança</h1>
                <p>Clique no link abaixo para ativar sua conta:</p>
                <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Verificar Conta</a>
                <p style="margin-top: 20px; color: #666; font-size: 12px;">Este link expira em 15 minutos.</p>
                <p style="font-size: 10px; color: #aaa;">Se você não solicitou este e-mail, ignore-o.</p>
            </div>
        `
  };

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