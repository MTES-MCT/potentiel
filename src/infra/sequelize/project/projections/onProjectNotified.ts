import { ProjectNotified } from '../../../../modules/project/events'

export const onProjectNotified = (models) => async (event: ProjectNotified) => {
  const ProjectModel = models.Project
  const projectInstance = await ProjectModel.findByPk(event.payload.projectId)

  if (!projectInstance) {
    console.log(
      'Error: onProjectNotified projection failed to retrieve project from db',
      event
    )
    return
  }

  // update notifiedOn
  projectInstance.notifiedOn = event.payload.notifiedOn

  try {
    await projectInstance.save()
  } catch (e) {
    console.log(
      'Error: onProjectNotified projection failed to update project',
      event,
      e.message
    )
  }
}
