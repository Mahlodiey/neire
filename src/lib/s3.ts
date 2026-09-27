import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1',
});

export async function uploadFileToS3(key: string, fileContent: Buffer, contentType: string): Promise<string> {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
  };

  const result = await s3.upload(params).promise();
  return result.Location;
}

export async function deleteFileFromS3(key: string): Promise<void> {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
  };

  await s3.deleteObject(params).promise();
}

export function getS3Url(key: string): string {
  return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`;
}
