import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface ContratEDFRapprochéAutomatiquementPayload {
  projectId: string
  numero: string
  type: string
  dateEffet: string // de la forme MM/DD/YY (ex: 3/23/21)
  dateSignature: string // de la forme MM/DD/YY (ex: 3/23/21)
  dateMiseEnService: string // de la forme MM/DD/YY (ex: 3/23/21)
  duree: string
  statut: string
  rawValues: Record<string, string>
  score: number
}

export class ContratEDFRapprochéAutomatiquement
  extends BaseDomainEvent<ContratEDFRapprochéAutomatiquementPayload>
  implements DomainEvent
{
  public static type: 'ContratEDFRapprochéAutomatiquement' = 'ContratEDFRapprochéAutomatiquement'
  public type = ContratEDFRapprochéAutomatiquement.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ContratEDFRapprochéAutomatiquementPayload) {
    return undefined
  }
}
