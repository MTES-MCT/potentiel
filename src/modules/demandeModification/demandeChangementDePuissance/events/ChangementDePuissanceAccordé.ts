import { BaseDomainEvent, DomainEvent } from '@core/domain'

export type ChangementDePuissanceAccordéPayload = {
  demandeId: string
  projetId: string
  fichierRéponseId?: string
  accordéPar: string
  nouvellePuissance: number
  isDecisionJustice: boolean
}

export class ChangementDePuissanceAccordé
  extends BaseDomainEvent<ChangementDePuissanceAccordéPayload>
  implements DomainEvent
{
  public static type: 'ChangementDePuissanceAccordé' = 'ChangementDePuissanceAccordé'
  public type = ChangementDePuissanceAccordé.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ChangementDePuissanceAccordéPayload) {
    return payload.demandeId
  }
}
