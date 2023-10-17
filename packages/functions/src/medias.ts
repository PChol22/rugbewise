import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ApiHandler } from 'sst/node/api';
import { Bucket } from 'sst/node/bucket';
import { randomUUID } from 'crypto';
import { GetUploadUrlOutput } from '@rugbewise/contracts/medias';

const s3 = new S3Client({});
const bucketName = Bucket.mediaBucket.bucketName;

export const getUploadUrl = ApiHandler(async _evt => {
  const mediaId = randomUUID();

  const fileKey = `${mediaId}.mp4`;

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    const response: GetUploadUrlOutput = {
      uploadUrl,
      fileKey,
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error creating signed URL', error);

    throw error;
  }
});
