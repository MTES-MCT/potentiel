import { UniqueEntityID } from '../../../core/domain'
import { okAsync } from '../../../core/utils'
import { EntityNotFoundError, InfraNotAvailableError } from '@modules/shared'

const fakeLoad = <T>(aggregate: T) =>
  jest.fn((id: UniqueEntityID) =>
    okAsync<T, EntityNotFoundError | InfraNotAvailableError>(aggregate)
  )

export const fakeRepo = <T>(aggregate?: T) => ({
  save: jest.fn((aggregate: T) => okAsync<null, InfraNotAvailableError>(null)),
  load: aggregate ? fakeLoad(aggregate) : jest.fn(),
})
