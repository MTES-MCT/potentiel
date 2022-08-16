import { ok, Result, wrapInfra, ResultAsync } from '@core/utils'
import { User } from '@entities'
import { InfraNotAvailableError } from '@modules/shared'
import models from '../../models'

const { User } = models

export type GetUserById = {
  (id: string): ResultAsync<User | null, InfraNotAvailableError>
}

export const getUserById: GetUserById = (id) =>
  wrapInfra(User.findOne({ where: { id } })).andThen(
    (userRaw: any): Result<User | null, InfraNotAvailableError> => {
      return userRaw ? ok(userRaw.get()) : ok(null)
    }
  )
