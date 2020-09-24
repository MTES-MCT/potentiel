import { ProjectRepo } from '../../../dataAccess'
import { EventStore } from '../../eventStore/EventStore'
import { ProjectNotified } from '../events'
import { CandidateNotifiedForPeriode } from '../events/CandidateNotifiedForPeriode'
import { ProjectCertificateGenerated } from '../events/ProjectCertificateGenerated'
import { ProjectCertificateGenerationFailed } from '../events/ProjectCertificateGenerationFailed'

export const handleProjectCertificateGenerated = (
  eventStore: EventStore,
  deps: {
    findProjectById: ProjectRepo['findById']
  }
) => {
  eventStore.subscribe(ProjectCertificateGenerated.type, callback)
  eventStore.subscribe(ProjectCertificateGenerationFailed.type, callback)

  async function callback(
    event: ProjectCertificateGenerated | ProjectCertificateGenerationFailed
  ) {
    // const transactionId = Math.floor(Math.random() * 1e3)
    // console.log('handleProjectCertificateGenerated', event)
    const {
      payload: { projectId, periodeId, appelOffreId, candidateEmail },
      requestId,
    } = event

    await eventStore.transaction(async ({ loadHistory, publish }) => {
      // console.log('starting transaction', transactionId)

      // Check if the candidate has been notified for this periode
      const hasCandidateBeenNotifiedForPeriodeResult = await loadHistory({
        eventType: CandidateNotifiedForPeriode.type,
        requestId: event.requestId,
        payload: {
          periodeId: event.payload.periodeId,
          appelOffreId: event.payload.appelOffreId,
          candidateEmail: event.payload.candidateEmail,
        },
      }).map((events) => !!events.length)

      if (hasCandidateBeenNotifiedForPeriodeResult.isErr()) {
        console.log(
          'handleProjectCertificateGenerated failed to retrieve hasCandidateBeenNotifiedForPeriodeResult',
          hasCandidateBeenNotifiedForPeriodeResult.error
        )
        return
      }

      if (hasCandidateBeenNotifiedForPeriodeResult.value) {
        // Already notified
        console.log(
          'handleProjectCertificateGenerated candidate already notified for periode, ignoring'
        )
        return
      }

      // Get a list of projectIds that have been notified for this periode and candidate
      const projectsNotifiedForThisCandidateAndPeriodeResult = await loadHistory(
        {
          eventType: ProjectNotified.type,
          payload: {
            periodeId: event.payload.periodeId,
            appelOffreId: event.payload.appelOffreId,
            candidateEmail: event.payload.candidateEmail,
          },
        }
      ).map((projectNotifiedEvents: ProjectNotified[]) =>
        projectNotifiedEvents.map((item) => item.payload.projectId)
      )

      if (projectsNotifiedForThisCandidateAndPeriodeResult.isErr()) {
        console.log(
          'handleProjectCertificateGenerated failed to retrieve projectsNotifiedForThisCandidateAndPeriodeResult',
          projectsNotifiedForThisCandidateAndPeriodeResult.error
        )
        return
      }

      if (!projectsNotifiedForThisCandidateAndPeriodeResult.value.length) {
        // No project notified for periode and candidate
        console.log(
          'handleProjectCertificateGenerated no project notified for periode, ignoring'
        )
        return
      }

      // Get a list of certificate events for this periode and candidate
      const certificatesForThisCandidateAndPeriodeResult = await loadHistory({
        eventType: [
          ProjectCertificateGenerated.type,
          ProjectCertificateGenerationFailed.type,
        ],
        payload: {
          periodeId: event.payload.periodeId,
          appelOffreId: event.payload.appelOffreId,
          candidateEmail: event.payload.candidateEmail,
        },
      }).map(
        (
          projectCertificateGeneratedEvents: (
            | ProjectCertificateGenerated
            | ProjectCertificateGenerationFailed
          )[]
        ) =>
          projectCertificateGeneratedEvents.map(
            (item) => item.payload.projectId
          )
      )

      if (certificatesForThisCandidateAndPeriodeResult.isErr()) {
        console.log(
          'handleProjectCertificateGenerated failed to retrieve certificatesForThisCandidateAndPeriodeResult',
          certificatesForThisCandidateAndPeriodeResult.error
        )
        return
      }

      // Check if there are all there
      const allCertificatesDone = projectsNotifiedForThisCandidateAndPeriodeResult.value.every(
        (projectId) =>
          certificatesForThisCandidateAndPeriodeResult.value.includes(projectId)
      )

      if (!allCertificatesDone) {
        // Still waiting for some certificates
        console.log(
          'handleProjectCertificateGenerated still waiting for some certificates, ignoring'
        )
        return
      }
      console.log(
        'handleProjectCertificateGenerated all notified projects have certificates, publishing CandidateNotifiedForPeriode'
      )

      // Retrieve project to get candidateName
      // TODO: replace this with a narrower query (ex: getCandidateNameByProject)
      const project = await deps.findProjectById(projectId)

      publish(
        new CandidateNotifiedForPeriode({
          payload: {
            periodeId,
            candidateEmail,
            candidateName: project?.nomRepresentantLegal || '',
            appelOffreId,
          },
          requestId,
        })
      )
    })
    // console.log('ending transaction ', transactionId)
  }
}
