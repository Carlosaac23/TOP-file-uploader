import { Readable } from 'stream';

import { cloudinary } from '../lib/cloudinary.js';

export function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'file-uploader', resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}

export async function deleteFromCloudinary(key, resourceType) {
  const result = await cloudinary.uploader.destroy(key, { resource_type: resourceType });
  console.log('Cloudinary delete result:', result);
  return result;
}
