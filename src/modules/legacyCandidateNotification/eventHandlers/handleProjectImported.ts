import { TransactionalRepository, UniqueEntityID } from '../../../core/domain'
import { logger } from '../../../core/utils'
import { IsPeriodeLegacy } from '../../appelOffre'
import { ProjectImported, ProjectReimported } from '../../project'
import { makeLegacyCandidateNotificationId } from '../helpers'
import { LegacyCandidateNotification } from '../LegacyCandidateNotification'

export const handleProjectImported = (deps: {
  isPeriodeLegacy: IsPeriodeLegacy
  legacyCandidateNotificationRepo: TransactionalRepository<LegacyCandidateNotification>
}) => async (event: ProjectImported | ProjectReimported) => {
  const { isPeriodeLegacy, legacyCandidateNotificationRepo } = deps

  const { appelOffreId, periodeId, importId } = event.payload

  let email: string | null = null
  if (event instanceof ProjectImported) {
    email = event.payload.data.email
  } else {
    email = event.payload.data.email || null
  }

  const isLegacy = await isPeriodeLegacy({ appelOffreId, periodeId })

  if (email && isLegacy) {
    const res = await legacyCandidateNotificationRepo.transaction(
      new UniqueEntityID(makeLegacyCandidateNotificationId({ email, importId })),
      (legacyCandidateNotification) => {
        return legacyCandidateNotification.notify()
      },
      { acceptNew: true }
    )

    if (res.isErr()) {
      logger.error(res.error)
    }
  }
}
