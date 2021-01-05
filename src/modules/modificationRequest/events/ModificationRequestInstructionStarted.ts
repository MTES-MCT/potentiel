import { BaseDomainEvent, DomainEvent } from '../../../core/domain/DomainEvent'

export interface ModificationRequestInstructionStartedPayload {
  modificationRequestId: string
}
export class ModificationRequestInstructionStarted
  extends BaseDomainEvent<ModificationRequestInstructionStartedPayload>
  implements DomainEvent {
  public static type: 'ModificationRequestInstructionStarted' =
    'ModificationRequestInstructionStarted'

  public type = ModificationRequestInstructionStarted.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ModificationRequestInstructionStartedPayload) {
    // This event does not mutate an agregate
    return undefined
  }
}
