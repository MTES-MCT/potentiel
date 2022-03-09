import { makeFakeAuth } from '@infra/fakeAuth'
import { makeKeycloakAuth } from '@infra/keycloak'
import { EnsureRole, RegisterAuth } from '@modules/authN'
import { sequelizeInstance } from '../sequelize.config'
import { isProdEnv, isStagingEnv } from './env.config'
import { getUserByEmail } from './queries.config'
import { createUser } from './useCases.config'

let registerAuth: RegisterAuth
let ensureRole: EnsureRole

const useFakeAuth = process.env.USE_FAKE_AUTHN ? true : false

if (useFakeAuth) {
  console.log(`Authentication using Fake Auth`)

  const fakeAuth = makeFakeAuth({
    getUserByEmail,
    createUser,
  })

  registerAuth = fakeAuth.registerAuth
  ensureRole = fakeAuth.ensureRole
} else {
  const { KEYCLOAK_SERVER, KEYCLOAK_REALM, KEYCLOAK_USER_CLIENT_ID, KEYCLOAK_USER_CLIENT_SECRET } =
    process.env

  console.log(`Authentication through Keycloak server ${KEYCLOAK_SERVER}`)

  const keycloakAuth = makeKeycloakAuth({
    sequelizeInstance,
    KEYCLOAK_SERVER,
    KEYCLOAK_REALM,
    KEYCLOAK_USER_CLIENT_ID,
    KEYCLOAK_USER_CLIENT_SECRET,
    getUserByEmail,
    createUser,
  })

  registerAuth = keycloakAuth.registerAuth
  ensureRole = keycloakAuth.ensureRole
}

export { registerAuth, ensureRole }
