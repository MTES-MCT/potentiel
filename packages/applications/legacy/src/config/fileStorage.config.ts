import { makeS3FileStorageService } from '../infra/file';

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_ENDPOINT,
  S3_BUCKET,
} = process.env;

const missingVars = [
  'S3_BUCKET',
  'S3_ENDPOINT',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
].filter((key) => !process.env[key]);

if (missingVars.length) {
  const errorMsg = `Cannot start S3FileStorageService because of missing environment variables: ${missingVars.join(
    ', ',
  )}`;
  console.error(errorMsg);
  process.exit(1);
}

const fileStorageService = makeS3FileStorageService({
  accessKeyId: AWS_ACCESS_KEY_ID!,
  secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  endpoint: S3_ENDPOINT!,
  bucket: S3_BUCKET!,
});

console.log(`FileService will be using S3 on bucket ${S3_BUCKET}`);

export { fileStorageService };
