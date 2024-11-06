import { config } from 'dotenv';
import { z } from 'zod';

export const parseConfig = () => {
  const configSchema = z.object({
    // Potentiel API
    API_URL: z.string().url(),

    // OAuth configuration
    ISSUER_URL: z.string().url(),
    CLIENT_ID: z.string(),
    CLIENT_SECRET: z.string(),

    // S3 configuration
    S3_ENDPOINT: z.string().url(),
    AWS_REGION: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    S3_BUCKET: z.string(),
  });
  config();
  return configSchema.parse(process.env);
};
