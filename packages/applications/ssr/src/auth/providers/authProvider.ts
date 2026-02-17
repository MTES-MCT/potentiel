import z from 'zod';

const authProviderSchema = z.enum(['proconnect', 'keycloak', 'magic-link']);

export type AuthProvider = z.infer<typeof authProviderSchema>;

const authProviderEnvSchema = z
  .string()
  .transform((str) =>
    str
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  )
  .pipe(z.array(authProviderSchema));

const envSchema = z.object({
  AUTH_PROVIDERS: authProviderEnvSchema,
  AUTH_PROVIDERS_KO: authProviderEnvSchema,
  AUTH_PROVIDERS_DREAL_DGEC: authProviderEnvSchema,
});

type ProviderProps = {
  id: AuthProvider;
  isKO: boolean;
  isActifAgentsPublics: boolean;
};

export const getProviders = (): Partial<Record<AuthProvider, ProviderProps>> => {
  const result = envSchema.safeParse(process.env);

  if (result.error) {
    throw new Error(`Invalid environment variables: ${result.error.message}`);
  }

  const { AUTH_PROVIDERS, AUTH_PROVIDERS_KO, AUTH_PROVIDERS_DREAL_DGEC } = result.data;

  const koProviders = new Set(AUTH_PROVIDERS_KO);
  const enabledAgentsPublicsProviders = new Set(AUTH_PROVIDERS_DREAL_DGEC);

  const providers = AUTH_PROVIDERS.map((provider) => ({
    id: provider,
    isKO: koProviders.has(provider),
    isActifAgentsPublics: enabledAgentsPublicsProviders.has(provider),
  }));

  return Object.fromEntries(providers.map((provider) => [provider.id, provider]));
};
