import type { ImageLoader } from 'next/image';

const CLOUDINARY_CLOUD_NAME = process.env['NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'] || 'vizu';

/**
 * Cloudinary Image Loader para next/image
 *
 * Transforma URLs de imagem para usar o Cloudinary CDN com otimizações automáticas:
 * - Formato automático (WebP/AVIF)
 * - Redimensionamento responsivo
 * - Qualidade otimizada
 */
export const cloudinaryLoader: ImageLoader = ({ src, width, quality }) => {
  // Se a imagem já for uma URL completa do Cloudinary, extrair o public_id
  if (src.includes('res.cloudinary.com')) {
    // Extrair o path após /upload/
    const match = src.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (match?.[1]) {
      src = match[1];
    }
  }

  // Parâmetros de transformação do Cloudinary
  const params = [
    'f_auto',           // Formato automático (WebP/AVIF)
    'c_limit',          // Manter aspect ratio, limitar ao tamanho
    `w_${width}`,       // Largura
    `q_${quality || 'auto'}`,  // Qualidade
    'dpr_auto',         // Device pixel ratio automático
  ].join(',');

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${params}/${src}`;
};

/**
 * Gera URL de placeholder blur para uma imagem
 * Usa transformação do Cloudinary para gerar uma versão muito pequena e borrada
 */
export function getBlurDataURL(publicId: string): string {
  const params = [
    'f_auto',
    'c_scale',
    'w_10',             // Muito pequena
    'e_blur:1000',      // Muito borrada
    'q_1',              // Qualidade mínima
  ].join(',');

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${params}/${publicId}`;
}

/**
 * Gera URL otimizada para thumbnail
 */
export function getThumbnailURL(publicId: string, width = 300): string {
  const params = [
    'f_auto',
    'c_thumb',          // Crop inteligente para thumbnail
    'g_face',           // Foco no rosto se detectado
    `w_${width}`,
    `h_${width}`,
    'q_auto',
  ].join(',');

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${params}/${publicId}`;
}

/**
 * Gera URL para imagem de perfil (avatar)
 */
export function getAvatarURL(publicId: string, size = 100): string {
  const params = [
    'f_auto',
    'c_thumb',
    'g_face',
    'r_max',            // Bordas arredondadas (círculo)
    `w_${size}`,
    `h_${size}`,
    'q_auto',
  ].join(',');

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${params}/${publicId}`;
}
