import { BaseDomainEvent, BaseDomainEventProps, DomainEvent } from '@core/domain'

export interface GFValidéesPayload {
  projetId: string
  validéesPar: string
}

export class GFValidées extends BaseDomainEvent<GFValidéesPayload> implements DomainEvent {
  public static type: 'GFValidées' = 'GFValidées'
  public type = GFValidées.type
  currentVersion = 1

  constructor(props: BaseDomainEventProps<GFValidéesPayload>) {
    super(props)
  }

  aggregateIdFromPayload(payload: GFValidéesPayload) {
    return payload.projetId
  }
}
