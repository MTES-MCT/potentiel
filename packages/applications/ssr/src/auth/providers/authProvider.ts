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
  AUTH_PROVIDERS: authProviderEnvSchema.default(['proconnect', 'magic-link']),
  AUTH_PROVIDERS_KO: authProviderEnvSchema.default([]),
  AUTH_ENFORCE_PROCONNECT: z.stringbool().default(true),
});

type ProviderProps = {
  id: AuthProvider;
  isKO: boolean;
  isActifAgentsPublics: boolean;
};

export type ProviderConfigurationMap = Partial<Record<AuthProvider, ProviderProps>>;

export const getProviders = (): ProviderConfigurationMap => {
  const result = envSchema.safeParse(process.env);

  if (result.error) {
    throw new Error(`Invalid environment variables: ${result.error.message}`);
  }

  const { AUTH_PROVIDERS, AUTH_PROVIDERS_KO, AUTH_ENFORCE_PROCONNECT } = result.data;

  const koProviders = new Set(AUTH_PROVIDERS_KO);

  const providers = AUTH_PROVIDERS.map((provider) => ({
    id: provider,
    isKO: koProviders.has(provider),
    isActifAgentsPublics: provider === 'proconnect' || !AUTH_ENFORCE_PROCONNECT,
  }));

  return Object.fromEntries(providers.map((provider) => [provider.id, provider]));
};
