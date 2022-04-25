import { RequiredActionAlias } from '@keycloak/keycloak-admin-client/lib/defs/requiredActionProviderRepresentation'
import { authorizedTestEmails, isProdEnv } from '@config'
import { logger, ResultAsync } from '@core/utils'
import { OtherError, UnauthorizedError } from '@modules/shared'
import routes from '../../routes'
import { makeKeycloakClient } from './keycloakClient'
import { SendResetPasswordEmail } from 'src/modules/authN/queries/SendResetPasswordEmail'

export const sendResetPasswordEmail: SendResetPasswordEmail = (args) => {
  const {
    KEYCLOAK_ADMIN_CLIENT_ID,
    KEYCLOAK_USER_CLIENT_ID,
    KEYCLOAK_ADMIN_CLIENT_SECRET,
    KEYCLOAK_REALM,
    BASE_URL,
  } = process.env

  const { email } = args

  async function sendKeycloakResetPasswordEmail(): Promise<null> {
    const keycloakAdminClient = makeKeycloakClient()

    await keycloakAdminClient.auth({
      grantType: 'client_credentials',
      clientId: KEYCLOAK_ADMIN_CLIENT_ID!,
      clientSecret: KEYCLOAK_ADMIN_CLIENT_SECRET,
    })

    const usersWithEmail = await keycloakAdminClient.users.find({ email, realm: KEYCLOAK_REALM })

    const id = usersWithEmail.length ? usersWithEmail[0].id : undefined

    if (!id) {
      throw new Error(`Utilisateur introuvable.`)
    }

    if (isProdEnv || authorizedTestEmails.includes(email)) {
      await keycloakAdminClient.users.executeActionsEmail({
        id,
        clientId: KEYCLOAK_USER_CLIENT_ID,
        realm: KEYCLOAK_REALM,
        lifespan: 3600000,
        actions: [RequiredActionAlias.UPDATE_PASSWORD],
        redirectUri: BASE_URL + routes.REDIRECT_BASED_ON_ROLE,
      })
    } else {
      logger.info(
        `createKeyCloakCredentials prevented executeActionsEmail because ${email} is not in authorizedTestEmails (outside production).`
      )
    }

    return null
  }

  return ResultAsync.fromPromise(sendKeycloakResetPasswordEmail(), (e: any) => {
    logger.error(e)

    if (e instanceof UnauthorizedError) {
      return e
    }

    return new OtherError(e.message)
  })
}
