export function getProviderConfiguration(provider: string): {
  issuer: string;
  clientId: string;
  clientSecret: string;
} {
  if (provider === 'keycloak') {
    return {
      issuer: `${process.env.KEYCLOAK_SERVER}/realms/${process.env.KEYCLOAK_REALM}`,
      clientId: process.env.KEYCLOAK_USER_CLIENT_ID ?? '',
      clientSecret: process.env.KEYCLOAK_USER_CLIENT_SECRET ?? '',
    };
  } else if (provider === 'proconnect') {
    return {
      issuer: process.env.PROCONNECT_ISSUER ?? '',
      clientId: process.env.PROCONNECT_CLIENT_ID ?? '',
      clientSecret: process.env.PROCONNECT_CLIENT_SECRET ?? '',
    };
  } else {
    throw new Error(`Provider ${provider} not supported`);
  }
}

export function getProviderAccountUrl(provider: string) {
  if (provider === 'email') {
    return '';
  }

  const { issuer } = getProviderConfiguration(provider);
  const accountUrlTemplate =
    provider === 'keycloak'
      ? (process.env.KEYCLOAK_ACCOUNT ?? '')
      : provider === 'proconnect'
        ? (process.env.PROCONNECT_ACCOUNT ?? '')
        : '';

  return accountUrlTemplate.replace('{{issuer}}', issuer);
}
