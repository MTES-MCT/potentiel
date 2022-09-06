import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface DroitsSurLeProjetRévoquésPayload {
  projetId: string
  utilisateurId: string
  cause?: 'changement producteur'
}
export class DroitsSurLeProjetRévoqués
  extends BaseDomainEvent<DroitsSurLeProjetRévoquésPayload>
  implements DomainEvent
{
  public static type: 'DroitsSurLeProjetRévoqués' = 'DroitsSurLeProjetRévoqués'
  public type = DroitsSurLeProjetRévoqués.type
  currentVersion = 1

  aggregateIdFromPayload(payload: DroitsSurLeProjetRévoquésPayload) {
    return payload.projetId
  }
}
