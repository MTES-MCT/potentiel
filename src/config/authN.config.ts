import { makeFakeAuth } from '../infra/fakeAuth'
import { makeKeycloakAuth } from '../infra/keycloak'
import { EnsureRole, RegisterAuth } from '../modules/users'
import { sequelizeInstance } from '../sequelize.config'
import { isProdEnv, isStagingEnv } from './env.config'
import { getUserByEmail } from './queries.config'
import { registerFirstUserLogin } from './useCases.config'

let registerAuth: RegisterAuth
let ensureRole: EnsureRole

if (isProdEnv || isStagingEnv) {
  const {
    KEYCLOAK_SERVER,
    KEYCLOAK_REALM,
    KEYCLOAK_USER_CLIENT_ID,
    KEYCLOAK_USER_CLIENT_SECRET,
  } = process.env

  console.log(`Authentication through Keycloak server ${KEYCLOAK_SERVER}`)

  const keycloakAuth = makeKeycloakAuth({
    sequelizeInstance,
    KEYCLOAK_SERVER,
    KEYCLOAK_REALM,
    KEYCLOAK_USER_CLIENT_ID,
    KEYCLOAK_USER_CLIENT_SECRET,
    getUserByEmail,
    registerFirstUserLogin,
  })

  registerAuth = keycloakAuth.registerAuth
  ensureRole = keycloakAuth.ensureRole
} else {
  console.log(`Authentication using Fake Auth`)

  const fakeAuth = makeFakeAuth({
    getUserByEmail,
    registerFirstUserLogin,
  })

  registerAuth = fakeAuth.registerAuth
  ensureRole = fakeAuth.ensureRole
}

export { registerAuth, ensureRole }
