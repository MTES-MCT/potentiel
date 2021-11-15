import { ResultAsync } from 'neverthrow'
import {
  DomainEvent,
  EventStoreHistoryFilters,
  EventStoreTransactionArgs,
} from '../../../core/domain'
import { InfraNotAvailableError } from '../../../modules/shared'
import { makeFakeEventBus } from './fakeEventBus'

export const makeFakeEventStore = (
  fakeLoadHistory: (
    filters?: EventStoreHistoryFilters
  ) => ResultAsync<DomainEvent[], InfraNotAvailableError>
) => {
  const fakePublish = jest.fn((event: DomainEvent) => {})
  return {
    ...makeFakeEventBus(),
    fakePublish,
    transaction: <T>(fn: (args: EventStoreTransactionArgs) => T) => {
      return ResultAsync.fromPromise(
        Promise.resolve(fn({ loadHistory: fakeLoadHistory, publish: fakePublish })),
        () => new InfraNotAvailableError()
      )
    },
  }
}
