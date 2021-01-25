import { logger, okAsync } from '../../../core/utils'
import { TransactionalRepository, UniqueEntityID } from '../../../core/domain'
import {
  ProjectCertificateGenerated,
  ProjectCertificateGenerationFailed,
} from '../../project/events'
import { makeCandidateNotificationId, CandidateNotification } from '../CandidateNotification'

export const handleProjectCertificateGeneratedOrFailed = (deps: {
  candidateNotificationRepo: TransactionalRepository<CandidateNotification>
}) => async (event: ProjectCertificateGenerated | ProjectCertificateGenerationFailed) => {
  const {
    payload: { periodeId, appelOffreId, candidateEmail },
  } = event

  const candidateNotificationId = new UniqueEntityID(
    makeCandidateNotificationId({
      appelOffreId,
      periodeId,
      candidateEmail,
    })
  )

  const res = await deps.candidateNotificationRepo.transaction(
    candidateNotificationId,
    (candidateNotification) => {
      candidateNotification.notifyCandidateIfReady()
      return okAsync(null)
    }
  )
  if (res.isErr()) {
    logger.error(res.error as Error)
  }
}
