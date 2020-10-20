import { Project, Periode, AppelOffre } from '../../../entities'
import { DomainEvent, BaseDomainEvent } from '../../../core/domain/DomainEvent'
import { CandidateNotification } from '../CandidateNotification'

export interface CandidateNotifiedForPeriodePayload {
  candidateEmail: Project['email']
  candidateName: string
  periodeId: Periode['id']
  appelOffreId: AppelOffre['id']
}
export class CandidateNotifiedForPeriode
  extends BaseDomainEvent<CandidateNotifiedForPeriodePayload>
  implements DomainEvent {
  public static type: 'CandidateNotifiedForPeriode' =
    'CandidateNotifiedForPeriode'
  public type = CandidateNotifiedForPeriode.type
  currentVersion = 1

  aggregateIdFromPayload(payload: CandidateNotifiedForPeriodePayload) {
    return CandidateNotification.makeId(payload)
  }
}
