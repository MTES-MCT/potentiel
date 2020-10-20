import { EventStore } from '../../../../modules/eventStore'
import { ProjectDataCorrected } from '../../../../modules/project/events'

export const onProjectDataCorrected = (models) => async (
  event: ProjectDataCorrected
) => {
  const ProjectModel = models.Project
  const projectInstance = await ProjectModel.findByPk(event.payload.projectId)

  if (!projectInstance) {
    console.log(
      'Error: onProjectDataCorrected projection failed to retrieve project from db',
      event
    )
    return
  }

  const { isClasse, ...otherUpdates } = event.payload.correctedData

  Object.assign(projectInstance, otherUpdates)

  if (typeof isClasse !== 'undefined') {
    projectInstance.classe = isClasse ? 'Classé' : 'Eliminé'
  }

  try {
    await projectInstance.save()
  } catch (e) {
    console.log(
      'Error: onProjectDataCorrected projection failed to update project',
      event,
      e.message
    )
  }
}
