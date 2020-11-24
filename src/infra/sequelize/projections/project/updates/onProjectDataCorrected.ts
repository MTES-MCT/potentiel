import { ProjectDataCorrected } from '../../../../../modules/project/events'

export const onProjectDataCorrected = (models) => async (event: ProjectDataCorrected) => {
  const ProjectModel = models.Project
  const projectInstance = await ProjectModel.findByPk(event.payload.projectId)

  if (!projectInstance) {
    console.log(
      'Error: onProjectDataCorrected projection failed to retrieve project from db',
      event
    )
    return
  }

  Object.assign(projectInstance, event.payload.correctedData)

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
