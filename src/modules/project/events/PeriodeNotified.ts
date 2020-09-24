import { AppelOffre, Periode, Project, User } from '../../../entities'
import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'

export interface PeriodeNotifiedPayload {
  periodeId: Periode['id']
  appelOffreId: AppelOffre['id']
  notifiedOn: Project['notifiedOn']
  requestedBy: User['id']
}
export class PeriodeNotified
  extends BaseDomainEvent<PeriodeNotifiedPayload>
  implements DomainEvent {
  public static type: 'PeriodeNotified' = 'PeriodeNotified'
  public type = PeriodeNotified.type
  currentVersion = 1
}
