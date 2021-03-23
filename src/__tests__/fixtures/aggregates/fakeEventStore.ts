import { okAsync, ResultAsync } from 'neverthrow'
import { DomainEvent } from '../../../core/domain'
import { EventStoreTransactionArgs, EventStoreHistoryFilters } from '../../../modules/eventStore'
import { InfraNotAvailableError } from '../../../modules/shared'

export const makeFakeEventStore = (
  fakeLoadHistory: (
    filters?: EventStoreHistoryFilters
  ) => ResultAsync<DomainEvent[], InfraNotAvailableError>
) => {
  const fakePublish = jest.fn((event: DomainEvent) => {})
  return {
    publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
    subscribe: jest.fn(
      <T extends DomainEvent>(eventType: T['type'], callback: (event: T) => any) => {}
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
