import { AppelOffre, Periode, Project, User } from '../../entities'
import {
  AggregateRoot,
  UniqueEntityID,
  DomainError,
  DomainEvent,
} from '../../core/domain'
import { Result, ok } from '../../core/utils'
import { StoredEvent } from '../eventStore'
import {
  ProjectCertificateGenerated,
  ProjectCertificateGenerationFailed,
  ProjectNotified,
} from '../project/events'
import { CandidateNotifiedForPeriode } from './events'

interface CandidateNotificationProps {
  appelOffreId: AppelOffre['id']
  periodeId: Periode['id']
  candidateEmail: Project['email']
  candidateName: string
  isCandidateNotified?: boolean
  candidateProjectsWithCertificate?: Record<string, boolean>
}

export class CandidateNotification extends AggregateRoot<
  CandidateNotificationProps,
  StoredEvent
> {
  private constructor(props: CandidateNotificationProps, id?: UniqueEntityID) {
    super(props, id)
  }

  private setCandidateNotified() {
    this.props.isCandidateNotified = true
  }

  private addNotifiedProjectToCandidate(projectId: string) {
    if (!this.props.candidateProjectsWithCertificate)
      this.props.candidateProjectsWithCertificate = {}

    this.props.candidateProjectsWithCertificate[projectId] = false
  }

  private registerCertificateForProject(projectId: string) {
    if (
      this.props.candidateProjectsWithCertificate &&
      projectId in this.props.candidateProjectsWithCertificate
    ) {
      this.props.candidateProjectsWithCertificate[projectId] = true
    }
  }

  public reloadFromHistory(
    events: StoredEvent[],
    currentRequestId?: DomainEvent['requestId']
  ) {
    // events is a time-sorted list of events related to this specific candidateNotification
    for (const event of events) {
      switch (event.type) {
        case CandidateNotifiedForPeriode.type:
          this.setCandidateNotified()
          break
        case ProjectNotified.type:
          this.addNotifiedProjectToCandidate(event.payload.projectId)
          break
        case ProjectCertificateGenerated.type:
        case ProjectCertificateGenerationFailed.type:
          this.registerCertificateForProject(event.payload.projectId)
          break
        default:
          // ignore other event types
          break
      }
    }

    this.triggerEventIfCandidateShouldBeNotified(currentRequestId)
  }

  private triggerEventIfCandidateShouldBeNotified(
    currentRequestId: DomainEvent['requestId']
  ) {
    if (this.shouldCandidateBeNotified()) {
      this.addDomainEvent(
        new CandidateNotifiedForPeriode({
          payload: {
            periodeId: this.props.periodeId,
            appelOffreId: this.props.appelOffreId,
            candidateEmail: this.props.candidateEmail,
            candidateName: this.props.candidateName,
          },
          requestId: currentRequestId,
        })
      )
    }
  }

  public shouldCandidateBeNotified(): boolean {
    // Candidate should be notified if all their projects have a certificate and they have not been notified yey
    return (
      !this.props.isCandidateNotified &&
      !!this.props.candidateProjectsWithCertificate &&
      Object.values(this.props.candidateProjectsWithCertificate).every(
        (item) => item
      )
    )
  }

  public static makeId(args: {
    appelOffreId: AppelOffre['id']
    periodeId: Periode['id']
    candidateEmail: Project['email']
  }) {
    const { appelOffreId, periodeId, candidateEmail } = args
    const key = { appelOffreId, periodeId, candidateEmail }

    return JSON.stringify(key, Object.keys(key).sort()) // This makes the stringify stable (key order)
  }

  public static create(
    props: CandidateNotificationProps,
    id?: UniqueEntityID
  ): Result<CandidateNotification, DomainError> {
    const candidateNotification = new CandidateNotification(
      { ...props, isCandidateNotified: props.isCandidateNotified ?? false },
      id ||
        new UniqueEntityID(
          this.makeId({
            appelOffreId: props.appelOffreId,
            periodeId: props.periodeId,
            candidateEmail: props.candidateEmail,
          })
        )
    )

    return ok(candidateNotification)
  }
}
