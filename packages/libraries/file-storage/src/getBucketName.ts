export function getBucketName() {
  return process.env.S3_BUCKET || '';
}
