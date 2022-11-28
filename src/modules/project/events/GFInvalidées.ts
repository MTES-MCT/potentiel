import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

export interface GFInvalidéesPayload {
  projetId: string
  invalidéesPar: string
}

export class GFInvalidées extends BaseDomainEvent<GFInvalidéesPayload> implements DomainEvent {
  public static type: 'GFInvalidées' = 'GFInvalidées'
  public type = GFInvalidées.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<GFInvalidéesPayload>) {
    super(props)
  }

  aggregateIdFromPayload(payload: GFInvalidéesPayload) {
    return payload.projetId
  }
}
