import { DomainEvent } from '../../core/domain'
import { ResultAsync } from '../../core/utils'
import { InfraNotAvailableError } from '../shared'

export type EventBus = {
  publish: (event: DomainEvent) => ResultAsync<null, InfraNotAvailableError>
  subscribe: <T extends DomainEvent>(eventType: T['type'], callback: (event: T) => any) => void
}
