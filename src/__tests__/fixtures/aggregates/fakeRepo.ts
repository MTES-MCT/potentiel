import { okAsync } from '@core/utils'
import { EntityNotFoundError, InfraNotAvailableError } from '@modules/shared'

const fakeLoad = <T>(aggregate: T) =>
  jest.fn(() => okAsync<T, EntityNotFoundError | InfraNotAvailableError>(aggregate))

export const fakeRepo = <T>(aggregate?: T) => ({
  save: jest.fn(() => okAsync<null, InfraNotAvailableError>(null)),
  load: aggregate ? fakeLoad(aggregate) : jest.fn(),
})
