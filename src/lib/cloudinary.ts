import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env['CLOUDINARY_CLOUD_NAME'],
  api_key: process.env['CLOUDINARY_API_KEY'],
  api_secret: process.env['CLOUDINARY_API_SECRET'],
  secure: true,
});

export { cloudinary };

export interface UploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadImage(
  file: Buffer | string,
  options?: {
    folder?: string;
    transformation?: object[];
  }
): Promise<UploadResult> {
  const uploadOptions = {
    folder: options?.folder ?? 'vizu/photos',
    resource_type: 'image' as const,
    transformation: options?.transformation ?? [
      { width: 1200, height: 1200, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
  };

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            public_id: result.public_id,
            secure_url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          });
        } else {
          reject(new Error('Upload failed: No result returned'));
        }
      }
    );

    if (typeof file === 'string') {
      // Base64 or URL
      cloudinary.uploader.upload(file, uploadOptions).then(resolve).catch(reject);
    } else {
      // Buffer
      uploadStream.end(file);
    }
  });
}

export function getOptimizedUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
  }
): string {
  return cloudinary.url(publicId, {
    transformation: [
      {
        width: options?.width ?? 800,
        height: options?.height ?? 800,
        crop: options?.crop ?? 'fill',
        gravity: 'face',
      },
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
  });
}

export function getThumbnailUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    transformation: [
      { width: 200, height: 200, crop: 'fill', gravity: 'face' },
      { quality: 'auto:low' },
      { fetch_format: 'auto' },
    ],
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export async function uploadToCloudinary(
  buffer: Buffer,
  options?: { folder?: string }
): Promise<{ url: string; thumbnailUrl: string; publicId: string }> {
  const result = await uploadImage(buffer, { folder: options?.folder });
  return {
    url: result.secure_url,
    thumbnailUrl: getThumbnailUrl(result.public_id),
    publicId: result.public_id,
  };
}
