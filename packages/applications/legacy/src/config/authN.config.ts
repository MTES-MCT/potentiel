import { makeKeycloakAuth } from '../infra/keycloak';
import { getUserByEmail } from './queries.config';
import { createUser } from './useCases.config';

const getKeycloakAuth = () => {
  const { NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME } = process.env;

  return makeKeycloakAuth({
    NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME,
    getUserByEmail,
    createUser,
  });
};

const { registerAuth, ensureRole } = getKeycloakAuth();

export { registerAuth, ensureRole };
