import { logger } from '../../../../../core/utils'
import { InvitationToProjectCancelled } from '../../../../../modules/authorization'

export const onInvitationToProjectCancelled = (models) => async (
  event: InvitationToProjectCancelled
) => {
  const { ProjectAdmissionKey } = models
  const { projectAdmissionKeyId } = event.payload

  try {
    const instance = await ProjectAdmissionKey.findByPk(projectAdmissionKeyId)

    if (!instance) {
      logger.error(
        new Error('onInvitationToProjectCancelled cannot find projectAdmissionKey to update')
      )
      return
    }

    instance.cancelled = true
    await instance.save()
  } catch (e) {
    logger.error(e)
  }
}
