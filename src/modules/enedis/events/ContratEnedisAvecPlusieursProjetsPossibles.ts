import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

type Match = {
  projectId: string
  score: number
}

export interface ContratEnedisAvecPlusieursProjetsPossiblesPayload {
  numero: string
  rawValues: Record<string, string>
  matches: Match[]
}

export class ContratEnedisAvecPlusieursProjetsPossibles
  extends BaseDomainEvent<ContratEnedisAvecPlusieursProjetsPossiblesPayload>
  implements DomainEvent
{
  public static type: 'ContratEnedisAvecPlusieursProjetsPossibles' =
    'ContratEnedisAvecPlusieursProjetsPossibles'
  public type = ContratEnedisAvecPlusieursProjetsPossibles.type
  currentVersion = 1

  aggregateIdFromPayload(payload: ContratEnedisAvecPlusieursProjetsPossiblesPayload) {
    return undefined
  }
}
