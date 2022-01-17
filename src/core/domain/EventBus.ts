import { DomainEvent } from './DomainEvent'
import { ResultAsync } from '../utils'
import { InfraNotAvailableError } from '@modules/shared'

export type EventBus = {
  publish: (event: DomainEvent) => ResultAsync<null, InfraNotAvailableError>
  subscribe: <T extends DomainEvent>(eventType: T['type'], callback: (event: T) => any) => void
}
