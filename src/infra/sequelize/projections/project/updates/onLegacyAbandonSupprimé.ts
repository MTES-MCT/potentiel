import { logger } from '@core/utils'
import { LegacyAbandonSupprimé } from '@modules/project'

export const onLegacyAbandonSupprimé = (models) => async (event: LegacyAbandonSupprimé) => {
  const { Project } = models
  const {
    payload: { garantiesFinancieresDueOn, dcrDueOn, completionDueOn, projetId },
  } = event
  const projectInstance = await Project.findByPk(projetId)

  if (!projectInstance) {
    logger.error(
      `Error: onLegacyAbandonSupprimé projection failed to retrieve project from db': ${event}`
    )
    return
  }

  Object.assign(projectInstance, {
    abandonedOn: 0,
    garantiesFinancieresDueOn,
    dcrDueOn,
    completionDueOn,
  })

  try {
    await projectInstance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onLegacyAbandonSupprimé projection failed to update project', event)
  }
}
