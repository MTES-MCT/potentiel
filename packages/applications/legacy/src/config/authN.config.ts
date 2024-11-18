import { makeKeycloakAuth } from '../infra/keycloak';
import { getUserByEmail } from './queries.config';
import { createUser } from './useCases.config';

const getKeycloakAuth = () => {
  return makeKeycloakAuth({
    getUserByEmail,
    createUser,
  });
};

const { registerAuth, ensureRole } = getKeycloakAuth();

export { registerAuth, ensureRole };
