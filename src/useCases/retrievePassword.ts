import { makePasswordRetrieval } from '../entities'
import { PasswordRetrievalRepo, CredentialsRepo } from '../dataAccess'
import { ResultAsync, ErrorResult, Ok } from '../types'
import routes from '../routes'
import { NotificationService } from '../modules/notification'
import { logger } from '../core/utils'

interface MakeUseCaseProps {
  passwordRetrievalRepo: PasswordRetrievalRepo
  credentialsRepo: CredentialsRepo
  sendNotification: NotificationService['sendNotification']
}

interface CallUseCaseProps {
  email: string
}

export const RATE_LIMIT_REACHED =
  'Plusieurs demandes de récupération de mot de passe ont déjà été effectuées pour cette adresse. Merci de vérifier vos emails.'

export const SYSTEM_ERROR =
  "Votre demande n'a pas pu être traitée. Veuillez réessayer ou contacter un administrateur."

export default function makeRetrievePassword({
  passwordRetrievalRepo,
  credentialsRepo,
  sendNotification,
}: MakeUseCaseProps) {
  return async function retrievePassword({ email }: CallUseCaseProps): ResultAsync<null> {
    // Check if credentials exist
    const credentialsRes = await credentialsRepo.findByEmail(email)

    if (credentialsRes.is_none()) {
      return Ok(null)
    }

    const credentials = credentialsRes.unwrap()

    // Check if too many password retrievals havent been done
    const passwordRetrievalCounts = await passwordRetrievalRepo.countSince(
      email,
      Date.now() - 24 * 3600 * 1000
    )

    if (passwordRetrievalCounts >= 5) {
      return ErrorResult(RATE_LIMIT_REACHED)
    }

    const passwordRetrievalResult = makePasswordRetrieval({
      email,
      createdOn: Date.now(),
    })

    if (passwordRetrievalResult.is_err()) {
      logger.error(passwordRetrievalResult.unwrap_err())
      return ErrorResult(SYSTEM_ERROR)
    }

    const passwordRetrieval = passwordRetrievalResult.unwrap()

    const insertionResult = await passwordRetrievalRepo.insert(passwordRetrieval)

    if (insertionResult.is_err()) {
      logger.error(insertionResult.unwrap_err())
      return ErrorResult(SYSTEM_ERROR)
    }

    // Send email
    await sendNotification({
      type: 'password-reset',
      message: {
        email,
        subject: 'Récupération de mot de passe Potentiel',
      },
      context: {
        passwordRetrievalId: passwordRetrieval.id,
        userId: credentials.id,
      },
      variables: {
        password_reset_link: routes.RESET_PASSWORD_LINK({
          resetCode: passwordRetrieval.id,
        }),
      },
    })
    return Ok(null)
  }
}
