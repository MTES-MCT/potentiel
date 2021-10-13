import { DomainEvent, UniqueEntityID } from '../../core/domain'
import { err, ok, Result, stableStringify } from '../../core/utils'
import { AppelOffre, Periode, Project } from '../../entities'
import { EventStoreAggregate } from '../eventStore/EventStoreAggregate'
import {
  ProjectCertificateGenerated,
  ProjectCertificateGenerationFailed,
  ProjectNotified,
} from '../project/events'
import { EntityNotFoundError } from '../shared'
import { HeterogeneousHistoryError } from '../shared/errors'
import { CandidateNotifiedForPeriode } from './events'

export interface CandidateNotification extends EventStoreAggregate {
  notifyCandidateIfReady: () => void
}

interface CandidateNotificationProps {
  candidateAndPeriode?: {
    appelOffreId: string
    periodeId: string
    candidateEmail: string
  }
  candidateName: string
  isMixedCandidateOrPeriode: boolean // true if history has items from multiple different periode or candidateEmails => error state
  isCandidateNotified: boolean
  candidateProjectsWithCertificate: Record<string, boolean>
  latestRequestId?: string
}

export const makeCandidateNotification = (args: {
  events: DomainEvent[]
  id: UniqueEntityID
}): Result<CandidateNotification, EntityNotFoundError | HeterogeneousHistoryError> => {
  const { events, id } = args

  if (!events || !events.length) {
    return err(new EntityNotFoundError())
  }

  const props: CandidateNotificationProps = {
    candidateAndPeriode: undefined,
    candidateName: '',
    isMixedCandidateOrPeriode: false, // true if history has items from multiple different periode or candidateEmails => error state
    isCandidateNotified: false,
    candidateProjectsWithCertificate: {},
    latestRequestId: undefined,
  }

  const pendingEvents: DomainEvent[] = []

  for (const event of events) {
    switch (event.type) {
      case CandidateNotifiedForPeriode.type:
        props.isCandidateNotified = true
        break
      case ProjectNotified.type:
        addNotifiedProjectToCandidate(event.payload)
        break
      case ProjectCertificateGenerated.type:
      case ProjectCertificateGenerationFailed.type:
        registerCertificateForProject(event.payload.projectId)
        break
      default:
        // ignore other event types
        break
    }

    if (event.requestId) {
      props.latestRequestId = event.requestId
    }
  }

  if (props.isMixedCandidateOrPeriode) {
    return err(new HeterogeneousHistoryError())
  }

  return ok({
    notifyCandidateIfReady,
    get pendingEvents() {
      return pendingEvents
    },
    get id() {
      return id
    },
    get lastUpdatedOn() {
      // no versionning here
      return new Date(0)
    },
  })

  function addNotifiedProjectToCandidate(payload: {
    projectId: string
    candidateName: string
    appelOffreId: string
    periodeId: string
    candidateEmail: string
  }) {
    const { projectId, appelOffreId, periodeId, candidateEmail, candidateName } = payload

    if (!props.candidateProjectsWithCertificate) props.candidateProjectsWithCertificate = {}

    props.candidateProjectsWithCertificate[projectId] = false

    if (candidateName) {
      props.candidateName = candidateName
    }

    if (!props.candidateAndPeriode) {
      props.candidateAndPeriode = {
        appelOffreId,
        periodeId,
        candidateEmail,
      }
    } else {
      const { candidateAndPeriode } = props

      const projectHasSameCandidateAndPeriode =
        appelOffreId === candidateAndPeriode.appelOffreId &&
        periodeId === candidateAndPeriode.periodeId &&
        candidateEmail === candidateAndPeriode.candidateEmail

      if (!projectHasSameCandidateAndPeriode) {
        // This should never happen, we have an event with different candidate or periode as the others
        props.isMixedCandidateOrPeriode = true
      }
    }
  }

  function registerCertificateForProject(projectId: string) {
    if (
      props.candidateProjectsWithCertificate &&
      projectId in props.candidateProjectsWithCertificate
    ) {
      props.candidateProjectsWithCertificate[projectId] = true
    }
  }

  function notifyCandidateIfReady() {
    if (shouldCandidateBeNotified() && !!props.candidateAndPeriode) {
      const {
        candidateName,
        latestRequestId,
        candidateAndPeriode: { periodeId, appelOffreId, candidateEmail },
      } = props
      pendingEvents.push(
        new CandidateNotifiedForPeriode({
          payload: {
            periodeId,
            appelOffreId,
            candidateEmail,
            candidateName,
          },
          requestId: latestRequestId,
        })
      )
    }
  }

  function shouldCandidateBeNotified() {
    // Candidate should be notified if all their projects have a certificate and they have not been notified yey
    return (
      !props.isCandidateNotified &&
      !!props.candidateProjectsWithCertificate &&
      Object.values(props.candidateProjectsWithCertificate).every((item) => item)
    )
  }
}

export const makeCandidateNotificationId = (args: {
  appelOffreId: AppelOffre['id']
  periodeId: Periode['id']
  candidateEmail: Project['email']
}) => {
  const { appelOffreId, periodeId, candidateEmail } = args
  const key = { appelOffreId, periodeId, candidateEmail }

  return stableStringify(key)
}
