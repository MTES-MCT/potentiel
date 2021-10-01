import { UniqueEntityID } from '../../../core/domain'
import { okAsync, Result, ResultAsync } from '../../../core/utils'
import { EntityNotFoundError, InfraNotAvailableError } from '../../../modules/shared'
import makeFakeProject from '../project'

export const fakeTransactionalRepo = <T>(aggregate?: T) => ({
  transaction<K, E>(
    _: UniqueEntityID,
    cb: (aggregate: T) => ResultAsync<K, E> | Result<K, E>,
    opts?: { isNew: boolean }
  ) {
    return okAsync<null, E | EntityNotFoundError | InfraNotAvailableError>(null).andThen(() =>
      cb(aggregate || makeFakeProject())
    )
  },
})
