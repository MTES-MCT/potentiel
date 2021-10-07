import { makeLegacyCandidateNotificationId } from '..'
import { TransactionalRepository, UniqueEntityID } from '../../../core/domain'
import { ProjectImported, ProjectReimported } from '../../project'
import { LegacyCandidateNotification } from '../LegacyCandidateNotification'

export const handleProjectImported =
  (deps: {
    isPeriodeLegacy: (args: { appelOffreId: string; periodeId: string }) => Promise<boolean>
    legacyCandidateNotificationRepo: TransactionalRepository<LegacyCandidateNotification>
  }) =>
  async (event: ProjectImported | ProjectReimported) => {
    const { isPeriodeLegacy, legacyCandidateNotificationRepo } = deps

    const { appelOffreId, periodeId, importId } = event.payload

    let email: string | null = null
    if (event instanceof ProjectImported) {
      email = event.payload.data.email
    } else {
      email = event.payload.data.email || null
    }

    if (email && (await isPeriodeLegacy({ appelOffreId, periodeId }))) {
      await legacyCandidateNotificationRepo.transaction(
        new UniqueEntityID(makeLegacyCandidateNotificationId({ email, importId })),
        (legacyCandidateNotification) => {
          return legacyCandidateNotification.notify()
        }
      )
    }
  }
