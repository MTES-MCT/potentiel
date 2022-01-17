import { RequiredActionAlias } from 'keycloak-admin/lib/defs/requiredActionProviderRepresentation'
import { authorizedTestEmails, isProdEnv } from '../../config'
import { logger, ResultAsync } from '../../core/utils'
import { CreateUserCredentials } from '@modules/authN'
import { OtherError, UnauthorizedError } from '@modules/shared'
import routes from '../../routes'
import { makeKeycloakClient } from './keycloakClient'

const ONE_MONTH = 3600 * 24 * 30

export const createUserCredentials: CreateUserCredentials = (args) => {
  const {
    KEYCLOAK_ADMIN_CLIENT_ID,
    KEYCLOAK_USER_CLIENT_ID,
    KEYCLOAK_ADMIN_CLIENT_SECRET,
    KEYCLOAK_REALM,
    BASE_URL,
  } = process.env

  const { email, role, fullName } = args

  async function createKeyCloakCredentials(): Promise<null> {
    const keycloakAdminClient = makeKeycloakClient()

    await keycloakAdminClient.auth({
      grantType: 'client_credentials',
      clientId: KEYCLOAK_ADMIN_CLIENT_ID!,
      clientSecret: KEYCLOAK_ADMIN_CLIENT_SECRET,
    })

    const usersWithEmail = await keycloakAdminClient.users.find({ email, realm: KEYCLOAK_REALM })

    let id = usersWithEmail.length ? usersWithEmail[0].id : undefined

    if (id) {
      const roles = await keycloakAdminClient.users.listRealmRoleMappings({ id })

      if (!roles.map((r) => r.name).includes(role) && ['admin', 'dgec'].includes(role)) {
        throw new UnauthorizedError()
      }
    }

    if (!id) {
      const newUser = await keycloakAdminClient.users.create({
        realm: KEYCLOAK_REALM,
        username: email,
        lastName: fullName,
        enabled: true,
        email,
      })

      id = newUser.id

      const actions = [RequiredActionAlias.UPDATE_PASSWORD]

      if (!fullName) actions.push(RequiredActionAlias.UPDATE_PROFILE)

      if (isProdEnv || authorizedTestEmails.includes(email)) {
        await keycloakAdminClient.users.executeActionsEmail({
          id,
          clientId: KEYCLOAK_USER_CLIENT_ID,
          actions,
          realm: KEYCLOAK_REALM,
          redirectUri: BASE_URL + routes.REDIRECT_BASED_ON_ROLE,
          lifespan: ONE_MONTH,
        })
      } else {
        logger.info(
          `createKeyCloakCredentials prevented executeActionsEmail because ${email} is not in authorizedTestEmails (outside production).`
        )
      }
    }

    const realmRole = await keycloakAdminClient.roles.findOneByName({ name: role })
    if (!realmRole || !realmRole.id) {
      throw new Error(`Cannot find realmRole for ${role}`)
    }

    await keycloakAdminClient.users.addRealmRoleMappings({
      id,
      roles: [{ id: realmRole.id, name: realmRole.name! }],
    })

    return null
  }

  return ResultAsync.fromPromise(createKeyCloakCredentials(), (e: any) => {
    logger.error(e)

    if (e instanceof UnauthorizedError) {
      return e
    }

    return new OtherError(e.message)
  })
}
