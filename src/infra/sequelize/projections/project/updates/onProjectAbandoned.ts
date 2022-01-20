import { logger } from '@core/utils'
import { ProjectAbandoned } from '@modules/project'

export const onProjectAbandoned = (models) => async (event: ProjectAbandoned) => {
  const { Project } = models
  const projectInstance = await Project.findByPk(event.payload.projectId)

  if (!projectInstance) {
    logger.error(
      `Error: onProjectAbandoned projection failed to retrieve project from db': ${event}`
    )
    return
  }

  const { occurredAt } = event
  Object.assign(projectInstance, {
    abandonedOn: occurredAt.getTime(),
    garantiesFinancieresDueOn: 0,
    dcrDueOn: 0,
    completionDueOn: 0,
  })

  try {
    await projectInstance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectAbandoned projection failed to update project', event)
  }
}
