import { okAsync } from 'neverthrow'
import { DomainEvent } from '@core/domain'
import { InfraNotAvailableError } from '@modules/shared'

export const makeFakeEventBus = () => {
  return {
    publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
    subscribe: jest.fn(
      <T extends DomainEvent>(eventType: T['type'], callback: (event: T) => any) => {}
    ),
  }
}
