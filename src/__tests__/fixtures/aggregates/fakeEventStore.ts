import { ResultAsync } from 'neverthrow'
import { DomainEvent, EventStoreTransactionArgs } from '../../../core/domain'
import { InfraNotAvailableError } from '../../../modules/shared'
import { makeFakeEventBus } from './fakeEventBus'

export const makeFakeEventStore = (
  fakeLoadHistory: (aggregateId: string) => ResultAsync<DomainEvent[], InfraNotAvailableError>
) => {
  const fakePublish = jest.fn((event: DomainEvent) => {})
  return {
    ...makeFakeEventBus(),
    fakePublish,
    transaction: <T>(fn: (args: EventStoreTransactionArgs) => T) => {
      return fn({ loadHistory: fakeLoadHistory, publish: fakePublish })
    },
  }
}
