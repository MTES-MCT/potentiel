import { logger } from '../../../../../core/utils'
import { ProjectFournisseursUpdated } from '../../../../../modules/project/events'

export const onProjectFournisseursUpdated = (models) => async (
  event: ProjectFournisseursUpdated
) => {
  const { projectId, newFournisseurs, newEvaluationCarbone } = event.payload
  const { Project } = models
  const projectInstance = await Project.findByPk(projectId)

  if (!projectInstance) {
    logger.error(
      `Error: onProjectFournisseursUpdated projection failed to retrieve project from db: ${event}`
    )
    return
  }

  newFournisseurs.forEach(({ kind, name }) => {
    projectInstance.details[kind] = name
  })

  if (newEvaluationCarbone) projectInstance.evaluationCarbone = newEvaluationCarbone
  projectInstance.changed('details', true)

  try {
    await projectInstance.save()
  } catch (e) {
    logger.error(e)
    logger.info('Error: onProjectFournisseursUpdated projection failed to update project', event)
  }
}
