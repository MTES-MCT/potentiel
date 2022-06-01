import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

type Match = {
  projectId: string
  score: number
}

export interface ContratEDFAvecPlusieursProjetsPossiblesPayload {
  numero: string
  rawValues: Record<string, string>
  matches: Match[]
}

export class ContratEDFAvecPlusieursProjetsPossibles
  extends BaseDomainEvent<ContratEDFAvecPlusieursProjetsPossiblesPayload>
  implements DomainEvent
{
  public static type: 'ContratEDFAvecPlusieursProjetsPossibles' =
    'ContratEDFAvecPlusieursProjetsPossibles'
  public type = ContratEDFAvecPlusieursProjetsPossibles.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ContratEDFAvecPlusieursProjetsPossiblesPayload) {
    return undefined
  }
}
