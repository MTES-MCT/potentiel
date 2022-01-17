import { UniqueEntityID } from '../../../core/domain'
import { okAsync, Result, ResultAsync } from '../../../core/utils'
import { EntityNotFoundError, InfraNotAvailableError } from '@modules/shared'
import makeFakeProject from '../project'

export const fakeTransactionalRepo = <AggregateType>(aggregate?: AggregateType) => ({
  transaction<CallbackResult, CallbackError>(
    _: UniqueEntityID,
    cb: (
      aggregate: AggregateType
    ) => ResultAsync<CallbackResult, CallbackError> | Result<CallbackResult, CallbackError>,
    opts?: { isNew?: boolean; acceptNew?: boolean }
  ) {
    return okAsync<null, CallbackError | EntityNotFoundError | InfraNotAvailableError>(
      null
    ).andThen(() => cb(aggregate || makeFakeProject()))
  },
})
