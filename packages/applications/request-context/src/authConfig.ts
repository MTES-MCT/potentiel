import { z } from 'zod';
const OneHourInSeconds = 60 * 60;

const authConfigSchema = z.object({
  KEYCLOAK_SERVER: z.string().url(),
  KEYCLOAK_REALM: z.string(),
  KEYCLOAK_USER_CLIENT_ID: z.string(),
  KEYCLOAK_USER_CLIENT_SECRET: z.string(),
  PROCONNECT_ISSUER: z.string().url(),
  PROCONNECT_CLIENT_ID: z.string(),
  PROCONNECT_CLIENT_SECRET: z.string(),
  SESSION_MAX_AGE: z.coerce.number().default(OneHourInSeconds),
});

export const authConfig = authConfigSchema.parse(process.env);
