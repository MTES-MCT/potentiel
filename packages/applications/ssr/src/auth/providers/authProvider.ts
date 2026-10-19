import z from 'zod';

import type { ProfilAuthentification } from '../profilAuthentification';

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

  // les variables ci-dessous sont utilisées en cas de défaillance de proconnect, pour permettre aux agents publics d'accéder à Potentiel malgré la panne.
  AUTH_PROVIDERS_KO: authProviderEnvSchema.default([]).transform((providers) => new Set(providers)),
  AUTH_MAGICLINK_ENABLED_AGENTS: z.stringbool().default(false),
  AUTH_MAGICLINK_ENABLED_PARTENAIRES: z.stringbool().default(false),
});

export type ProviderProps = {
  id: AuthProvider;
  isKO: boolean;
  profils: Record<ProfilAuthentification, boolean>;
};

export type ProviderConfigurationMap = Partial<Record<AuthProvider, ProviderProps>>;

export const getProviders = (): ProviderConfigurationMap => {
  const result = envSchema.safeParse(process.env);

  if (result.error) {
    throw new Error(`Invalid environment variables: ${result.error.message}`);
  }

  const {
    AUTH_PROVIDERS,
    AUTH_PROVIDERS_KO,
    AUTH_MAGICLINK_ENABLED_AGENTS,
    AUTH_MAGICLINK_ENABLED_PARTENAIRES,
  } = result.data;

  const providers: ProviderProps[] = [
    {
      id: 'keycloak',
      isKO: AUTH_PROVIDERS_KO.has('keycloak'),
      // Keycloak n'est actif que pour des environnement de test.
      profils: {
        agents: true,
        porteurs: true,
        partenaires: true,
      },
    },
    {
      id: 'proconnect',
      isKO: AUTH_PROVIDERS_KO.has('proconnect'),
      profils: {
        agents: true,
        porteurs: true,
        partenaires: true,
      },
    },
    {
      id: 'magic-link',
      isKO: AUTH_PROVIDERS_KO.has('magic-link'),
      profils: {
        agents: AUTH_MAGICLINK_ENABLED_AGENTS,
        porteurs: true,
        partenaires: AUTH_MAGICLINK_ENABLED_PARTENAIRES,
      },
    },
  ];

  return Object.fromEntries(
    providers
      .filter(({ id }) => AUTH_PROVIDERS.includes(id))
      .map((provider) => [provider.id, provider]),
  );
};
