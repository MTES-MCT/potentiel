import { Repository, UniqueEntityID } from '../../../core/domain'
import {
  err,
  errAsync,
  fromOldResult,
  fromOldResultAsync,
  logger,
  okAsync,
  Result,
  ResultAsync,
} from '../../../core/utils'
import { UserRepo } from '../../../dataAccess'
import routes from '../../../routes'
import { makeProjectAdmissionKey, ProjectAdmissionKey, User } from '../../../entities'
import projectAdmissionKey from '../../../entities/projectAdmissionKey'
import { NotificationService } from '../../notification'
import {
  AggregateHasBeenUpdatedSinceError,
  EntityNotFoundError,
  InfraNotAvailableError,
  UnauthorizedError,
} from '../../shared'
import { GetUserByEmail } from '../queries'
import { UserWithEmailExistsAlreadyError } from '../errors'

interface InviteUserDeps {
  projectAdmissionKeyRepo: Repository<ProjectAdmissionKey>
  getUserByEmail: GetUserByEmail
  sendNotification: NotificationService['sendNotification']
}

interface InviteUserArgs {
  email: string
  forRole: 'acheteur-obligé'
  invitedBy: User
}

export const makeInviteUser = (deps: InviteUserDeps) => (
  args: InviteUserArgs
): ResultAsync<null, UserWithEmailExistsAlreadyError | InfraNotAvailableError> => {
  const { projectAdmissionKeyRepo, getUserByEmail, sendNotification } = deps
  const { email, forRole, invitedBy } = args

  if (!['admin'].includes(invitedBy.role)) {
    return errAsync(new UnauthorizedError())
  }

  return getUserByEmail(email)
    .andThen(
      (
        userOrNot
      ): Result<ProjectAdmissionKey, UserWithEmailExistsAlreadyError | InfraNotAvailableError> => {
        if (userOrNot !== null) {
          return err(new UserWithEmailExistsAlreadyError())
        }

        return fromOldResult(
          makeProjectAdmissionKey({
            email,
            forRole,
            fullName: '',
          })
        ).mapErr((e) => {
          logger.error(e)
          return new InfraNotAvailableError()
        })
      }
    )
    .andThen((projectAdmissionKey) => {
      return projectAdmissionKeyRepo.save(projectAdmissionKey).map(() => projectAdmissionKey)
    })
    .andThen((projectAdmissionKey) => {
      return ResultAsync.fromPromise(
        sendNotification({
          type: 'user-invitation',
          message: {
            email,
            subject: `Vous êtes invité à rejoindre Potentiel`,
          },
          context: {
            projectAdmissionKeyId: projectAdmissionKey.id,
            forRole,
          },
          variables: {
            invitation_link: routes.USER_INVITATION({
              projectAdmissionKey: projectAdmissionKey.id,
            }),
          },
        }),
        (e: Error) => {
          logger.error(e)
          return new InfraNotAvailableError()
        }
      )
    })
}
