import z from 'zod';

export const appSchema = z.object({
  APPLICATION_STAGE: z.enum(['production', 'staging', 'development', 'local', 'test']),
});

export const dbSchema = z.object({
  DATABASE_CONNECTION_STRING: z.url(),
});

export const s3Schema = z.object({
  S3_BUCKET: z.string(),
  S3_ENDPOINT: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
});
