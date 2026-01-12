import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { env } from '$lib/server/config/env';

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY
  }
});

/**
 * Faz upload de avatar otimizado para Cloudflare R2
 * - Redimensiona para 200x200px
 * - Converte para WebP (qualidade 80%)
 * - Tamanho final: ~20-30KB
 */
export async function uploadAvatar(
  userId: string,
  file: File
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  // Otimizar imagem com Sharp
  const optimized = await sharp(buffer)
    .resize(200, 200, {
      fit: 'cover',
      position: 'attention' // Detecta rosto/foco automaticamente
    })
    .sharpen() // Melhora nitidez após resize
    .webp({
      quality: 80,
      effort: 6 // Melhor compressão (0-6)
    })
    .toBuffer();

  const key = `avatars/${userId}.webp`;

  await r2.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: optimized,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000' // Cache 1 ano
    })
  );

  return `${env.R2_PUBLIC_URL}/${key}`;
}
