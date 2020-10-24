import { okAsync } from 'neverthrow'
import { ProjectRepo } from '../../../dataAccess'
import { EventStore } from '../../eventStore/EventStore'
import {
  ProjectCertificateGenerated,
  ProjectCertificateGenerationFailed,
} from '../../project/events'
import { CandidateNotification } from '../CandidateNotification'

export const handleProjectCertificateGenerated = (deps: {
  eventStore: EventStore
  findProjectById: ProjectRepo['findById']
}) => async (event: ProjectCertificateGenerated | ProjectCertificateGenerationFailed) => {
  const {
    payload: { projectId, periodeId, appelOffreId, candidateEmail },
    requestId,
  } = event

  const res = await deps.eventStore.transaction(async ({ loadHistory, publish }) => {
    // Retrieve project to get candidateName
    // TODO: replace this with a narrower query (ex: getCandidateNameByProject)
    // or maybe the event consumer should get the candidateName instead
    const project = await deps.findProjectById(projectId)

    // The CandidateNotification aggregate handles all the business logic,
    // this handler only loads the CandidateNotification from history
    // and triggers any domain events the aggregate produces

    const res = await CandidateNotification.create({
      appelOffreId,
      periodeId,
      candidateEmail,
      candidateName: project?.nomRepresentantLegal || '',
    })
      .asyncAndThen((candidateNotification) => {
        return loadHistory({
          aggregateId: CandidateNotification.makeId({
            appelOffreId,
            periodeId,
            candidateEmail,
          }),
        }).map((events) => ({ events, candidateNotification }))
      })
      .andThen(({ events, candidateNotification }) => {
        // Reconstruct candidate notification from prior events
        candidateNotification.reloadFromHistory(events, requestId)

        // Publish events triggered by candidateNotification
        for (const event of candidateNotification.domainEvents) {
          publish(event)
        }

        return okAsync(null)
      })

    if (res.isErr()) {
      throw res.error
    }
  })

  if (res.isErr()) {
    console.log('handleProjectCertificateGenerated failed to make the transaction', res.error)
  }
}
