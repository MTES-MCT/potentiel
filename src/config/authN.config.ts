import { makeFakeAuth } from '@infra/fakeAuth';
import { makeKeycloakAuth } from '@infra/keycloak';
import { sequelizeInstance } from '../sequelize.config';
import { getUserByEmail } from './queries.config';
import { createUser } from './useCases.config';

const useFakeAuth = process.env.USE_FAKE_AUTHN ? true : false;

const getFakeAuth = () => {
  console.log(`Authentication using Fake Auth`);

  return makeFakeAuth({
    getUserByEmail,
    createUser,
  });
};

const getKeycloakAuth = () => {
  const { KEYCLOAK_SERVER, KEYCLOAK_REALM, KEYCLOAK_USER_CLIENT_ID, KEYCLOAK_USER_CLIENT_SECRET } =
    process.env;

  console.log(`Authentication through Keycloak server ${KEYCLOAK_SERVER}`);

  return makeKeycloakAuth({
    sequelizeInstance,
    KEYCLOAK_SERVER,
    KEYCLOAK_REALM,
    KEYCLOAK_USER_CLIENT_ID,
    KEYCLOAK_USER_CLIENT_SECRET,
    getUserByEmail,
    createUser,
  });
};

const { registerAuth, ensureRole } = useFakeAuth ? getFakeAuth() : getKeycloakAuth();

export { registerAuth, ensureRole };
