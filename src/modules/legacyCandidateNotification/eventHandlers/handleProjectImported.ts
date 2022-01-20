import { TransactionalRepository, UniqueEntityID } from '@core/domain'
import { logger } from '@core/utils'
import { IsPeriodeLegacy } from '../../appelOffre'
import { ProjectImported, ProjectReimported } from '../../project'
import { makeLegacyCandidateNotificationId } from '../helpers'
import { LegacyCandidateNotification } from '../LegacyCandidateNotification'

export const handleProjectImported = (deps: {
  isPeriodeLegacy: IsPeriodeLegacy
  legacyCandidateNotificationRepo: TransactionalRepository<LegacyCandidateNotification>
}) => async (event: ProjectImported | ProjectReimported) => {
  const { isPeriodeLegacy, legacyCandidateNotificationRepo } = deps

  const { appelOffreId, periodeId, importId, data } = event.payload

  const { email } = data

  const isLegacy = await isPeriodeLegacy({ appelOffreId, periodeId })

  if (!email || !isLegacy) return
  ;(
    await legacyCandidateNotificationRepo.transaction(
      new UniqueEntityID(makeLegacyCandidateNotificationId({ email, importId })),
      (legacyCandidateNotification) => {
        return legacyCandidateNotification.notify()
      },
      { acceptNew: true }
    )
  ).match(
    () => {},
    (err) => {
      logger.error(err)
    }
  )
}
