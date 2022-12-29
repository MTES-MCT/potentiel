import { BaseDomainEvent, DomainEvent } from '@core/domain'
import { CahierDesChargesRéférence } from '@entities'

export type ChangementDePuissanceDemandéPayload = {
  demandeId: string
  projetId: string
  demandéPar: string
  authorité: 'dgec' | 'dreal'
  justification?: string
  fileId?: string
  cahierDesCharges?: CahierDesChargesRéférence
  puissance: number
  puissanceAuMomentDuDepot?: number // added later, so not always present
}

export class ChangementDePuissanceDemandé
  extends BaseDomainEvent<ChangementDePuissanceDemandéPayload>
  implements DomainEvent
{
  public static type: 'ChangementDePuissanceDemandé' = 'ChangementDePuissanceDemandé'
  public type = ChangementDePuissanceDemandé.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ChangementDePuissanceDemandéPayload) {
    return payload.demandeId
  }
}
