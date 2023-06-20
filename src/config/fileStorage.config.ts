import { makeS3FileStorageService } from '@infra/file';

const {
  LEGACY_S3_ACCESS_KEY_ID,
  LEGACY_S3_SECRET_ACCESS_KEY,
  LEGACY_S3_ENDPOINT,
  LEGACY_S3_BUCKET,
} = process.env;

const missingVars = [
  'LEGACY_S3_BUCKET',
  'LEGACY_S3_ENDPOINT',
  'LEGACY_S3_ACCESS_KEY_ID',
  'LEGACY_S3_SECRET_ACCESS_KEY',
].filter((key) => !process.env[key]);

if (missingVars.length) {
  const errorMsg = `Cannot start S3FileStorageService because of missing environment variables: ${missingVars.join(
    ', ',
  )}`;
  console.error(errorMsg);
  process.exit(1);
}

const fileStorageService = makeS3FileStorageService({
  accessKeyId: LEGACY_S3_ACCESS_KEY_ID!,
  secretAccessKey: LEGACY_S3_SECRET_ACCESS_KEY!,
  endpoint: LEGACY_S3_ENDPOINT!,
  bucket: LEGACY_S3_BUCKET!,
});

console.log(`FileService will be using S3 on bucket ${LEGACY_S3_BUCKET}`);

export { fileStorageService };
