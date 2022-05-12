import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface AppelOffreProjetModifiePayload {
  projectId: string
  appelOffreId: string
}
export class AppelOffreProjetModifie
  extends BaseDomainEvent<AppelOffreProjetModifiePayload>
  implements DomainEvent
{
  public static type: 'AppelOffreProjetModifie' = 'AppelOffreProjetModifie'
  public type = AppelOffreProjetModifie.type
  currentVersion = 1

  aggregateIdFromPayload(payload: AppelOffreProjetModifiePayload) {
    return payload.projectId
  }
}
