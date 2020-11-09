import { okAsync, ResultAsync } from 'neverthrow'
import {
  StoredEvent,
  EventStoreTransactionArgs,
  EventStoreHistoryFilters,
} from '../../../modules/eventStore'
import { InfraNotAvailableError } from '../../../modules/shared'

export const makeFakeEventStore = (
  fakeLoadHistory: (
    filters?: EventStoreHistoryFilters
  ) => ResultAsync<StoredEvent[], InfraNotAvailableError>
) => {
  const fakePublish = jest.fn((event: StoredEvent) => {})
  return {
    publish: jest.fn((event: StoredEvent) => okAsync<null, InfraNotAvailableError>(null)),
    subscribe: jest.fn(
      <T extends StoredEvent>(eventType: T['type'], callback: (event: T) => any) => {}
    ),
    fakePublish,
    transaction: <T>(fn: (args: EventStoreTransactionArgs) => T) => {
      return ResultAsync.fromPromise(
        Promise.resolve(fn({ loadHistory: fakeLoadHistory, publish: fakePublish })),
        () => new InfraNotAvailableError()
      )
    },
  }
}
