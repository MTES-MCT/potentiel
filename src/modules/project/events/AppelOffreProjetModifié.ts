import { BaseDomainEvent, DomainEvent } from '@core/domain'

export interface AppelOffreProjetModifiéPayload {
  projectId: string
  appelOffreId: string
}
export class AppelOffreProjetModifié
  extends BaseDomainEvent<AppelOffreProjetModifiéPayload>
  implements DomainEvent
{
  public static type: 'AppelOffreProjetModifié' = 'AppelOffreProjetModifié'
  public type = AppelOffreProjetModifié.type
  currentVersion = 1

  aggregateIdFromPayload(payload: AppelOffreProjetModifiéPayload) {
    return payload.projectId
  }
}
