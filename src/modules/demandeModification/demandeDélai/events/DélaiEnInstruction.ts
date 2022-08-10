import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type DélaiEnInstructionPayload = {
  demandeDélaiId: string
  modifiéPar: string
  projetId: string
}

export class DélaiEnInstruction
  extends BaseDomainEvent<DélaiEnInstructionPayload>
  implements DomainEvent
{
  public static type: 'DélaiEnInstruction' = 'DélaiEnInstruction'
  public type = DélaiEnInstruction.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DélaiEnInstructionPayload) {
    return payload.demandeDélaiId
  }
}
