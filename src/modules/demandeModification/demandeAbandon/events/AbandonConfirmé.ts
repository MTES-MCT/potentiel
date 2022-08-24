import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type AbandonConfirméPayload = {
  demandeAbandonId: string
  projetId: string
  confirméPar: string
}

export class AbandonConfirmé
  extends BaseDomainEvent<AbandonConfirméPayload>
  implements DomainEvent
{
  public static type: 'AbandonConfirmé' = 'AbandonConfirmé'
  public type = AbandonConfirmé.type
  currentVersion = 1

  aggregateIdFromPayload(payload: AbandonConfirméPayload) {
    return payload.demandeAbandonId
  }
}
