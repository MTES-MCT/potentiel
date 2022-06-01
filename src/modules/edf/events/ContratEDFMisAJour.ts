import { DomainEvent, BaseDomainEvent } from '@core/domain'

export interface ContratEDFMisAJourPayload {
  projectId: string
  numero: string
  type?: string
  dateEffet?: string // de la forme MM/DD/YY (ex: 3/23/21)
  dateSignature?: string // de la forme MM/DD/YY (ex: 3/23/21)
  dateMiseEnService?: string // de la forme MM/DD/YY (ex: 3/23/21)
  duree?: string
  statut?: string
}

export class ContratEDFMisAJour
  extends BaseDomainEvent<ContratEDFMisAJourPayload>
  implements DomainEvent
{
  public static type: 'ContratEDFMisAJour' = 'ContratEDFMisAJour'
  public type = ContratEDFMisAJour.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ContratEDFMisAJourPayload) {
    return undefined
  }
}
