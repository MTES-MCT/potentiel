import { makeKeycloakAuth } from '../infra/keycloak';
import { sequelizeInstance } from '../sequelize.config';
import { getUserByEmail } from './queries.config';
import { createUser } from './useCases.config';

const getKeycloakAuth = () => {
  const {
    KEYCLOAK_SERVER,
    KEYCLOAK_REALM,
    KEYCLOAK_USER_CLIENT_ID,
    KEYCLOAK_USER_CLIENT_SECRET,
    NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME,
  } = process.env;

  console.log(`Authentication through Keycloak server ${KEYCLOAK_SERVER}`);

  return makeKeycloakAuth({
    sequelizeInstance,
    KEYCLOAK_SERVER,
    KEYCLOAK_REALM,
    KEYCLOAK_USER_CLIENT_ID,
    KEYCLOAK_USER_CLIENT_SECRET,
    NEXT_AUTH_SESSION_TOKEN_COOKIE_NAME,
    getUserByEmail,
    createUser,
  });
};

const { registerAuth, ensureRole } = getKeycloakAuth();

export { registerAuth, ensureRole };
