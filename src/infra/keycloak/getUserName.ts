import { makeKeycloakClient } from './keycloakClient'
import { logger, ResultAsync } from '../../core/utils'
import { OtherError } from '@modules/shared'
import { GetUserName } from '../../modules/users'

const { KEYCLOAK_ADMIN_CLIENT_ID, KEYCLOAK_ADMIN_CLIENT_SECRET, KEYCLOAK_REALM } = process.env

export const getUserName: GetUserName = (id) => {
  async function getKeycloakUsername(): Promise<string> {
    const keycloakAdminClient = makeKeycloakClient()

    await keycloakAdminClient.auth({
      grantType: 'client_credentials',
      clientId: KEYCLOAK_ADMIN_CLIENT_ID!,
      clientSecret: KEYCLOAK_ADMIN_CLIENT_SECRET,
    })

    const user = await keycloakAdminClient.users.findOne({
      realm: KEYCLOAK_REALM,
      id,
    })

    if (!user) {
      logger.error(new Error(`Keycloak could not find user with id ${id}`))
    }

    return user?.lastName || ''
  }

  return ResultAsync.fromPromise(getKeycloakUsername(), (e: any) => {
    logger.error(e)
    return new OtherError(e.message)
  })
}
