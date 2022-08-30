import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type ConfirmationAbandonDemandéePayload = {
  demandeAbandonId: string
  projetId: string
  fichierRéponseId?: string
  demandéePar: string
}

export class ConfirmationAbandonDemandée
  extends BaseDomainEvent<ConfirmationAbandonDemandéePayload>
  implements DomainEvent
{
  public static type: 'ConfirmationAbandonDemandée' = 'ConfirmationAbandonDemandée'
  public type = ConfirmationAbandonDemandée.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ConfirmationAbandonDemandéePayload) {
    return payload.demandeAbandonId
  }
}
