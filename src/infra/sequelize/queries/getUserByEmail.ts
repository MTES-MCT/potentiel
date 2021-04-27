import { UniqueEntityID } from '../../../core/domain'
import { err, errAsync, logger, ok, Result, wrapInfra } from '../../../core/utils'
import { makeUser, User } from '../../../entities'
import { GetAppelOffre } from '../../../modules/appelOffre'
import { EntityNotFoundError, InfraNotAvailableError } from '../../../modules/shared'
import { GetUserByEmail } from '../../../modules/users/queries'

export const makeGetUserByEmail = (models): GetUserByEmail => (email) => {
  const { User } = models

  return wrapInfra(User.findOne({ where: { email } })).andThen(
    (userRaw: any): Result<User | null, InfraNotAvailableError> => {
      if (!userRaw) return ok(null)

      return ok(userRaw.get() as User)
    }
  )
}
