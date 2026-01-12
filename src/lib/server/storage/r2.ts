import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '$lib/server/env';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY
  }
});

/**
 * Faz upload de avatar para Cloudflare R2
 * @param userId - ID do usuário
 * @param file - Arquivo de imagem
 * @returns URL pública do avatar
 */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<string> {
  const ext = file.name.split('.').pop();
  const key = `avatars/${userId}-${Date.now()}.${ext}`;

  const buffer = await file.arrayBuffer();

  await r2.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: file.type
    })
  );

  return `${env.R2_PUBLIC_URL}/${key}`;
}
