import { ResultAsync } from '../../core/utils'
import { InfraNotAvailableError } from '../shared'
import { StoredEvent } from './StoredEvent'

export type EventBus = {
  publish: (event: StoredEvent) => ResultAsync<null, InfraNotAvailableError>
  subscribe: <T extends StoredEvent>(eventType: T['type'], callback: (event: T) => any) => void
}
