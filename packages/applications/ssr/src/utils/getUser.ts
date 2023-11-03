import { decode } from 'next-auth/jwt';
import { cookies } from 'next/headers';

const NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME = 'next-auth.session-token';

type User = {
  name: string;
  email: string;
  role?: string;
};

export const getUser = async (): Promise<User | null> => {
  const cookiesContent = await cookies();
  const sessionToken = cookiesContent.get(NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME)?.value;

  const decoded = await decode({
    token: sessionToken,
    secret: process.env.NEXTAUTH_SECRET ?? '',
  });

  if (decoded?.accessToken) {
    const {
      realm_access: { roles },
      name,
      email,
    } = mapToKeycloakToken(decoded.accessToken);
    const role = USER_ROLES.find((role) => roles.includes(role));

    return { role, name, email };
  }

  return null;
};

const mapToKeycloakToken = (accessToken: string) => {
  return JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString()) as KeycloakToken;
};

type KeycloakToken = {
  name: string;
  email: string;
  realm_access: {
    roles: Array<string>;
  };
};

const USER_ROLES = [
  'admin',
  'porteur-projet',
  'dreal',
  'acheteur-obligé',
  'ademe',
  'dgec-validateur',
  'caisse-des-dépôts',
  'cre',
];
