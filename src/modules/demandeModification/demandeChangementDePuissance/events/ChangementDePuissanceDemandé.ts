import { BaseDomainEvent, DomainEvent } from '@core/domain'
import { CahierDesChargesRéférence } from '@entities'

export type ChangementDePuissanceDemandéPayload = {
  demandeChangementDePuissanceId: string
  projetId: string
  demandéPar: string
  autorité: 'dreal'
  fichierId?: string
  justification?: string
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
    return payload.demandeChangementDePuissanceId
  }
}
