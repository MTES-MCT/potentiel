import { ProjectNotificationDateSet } from '../../../../modules/project/events'

export const onProjectNotificationDateSet = (models) => async (
  event: ProjectNotificationDateSet
) => {
  const ProjectModel = models.Project
  const projectInstance = await ProjectModel.findByPk(event.payload.projectId)

  if (!projectInstance) {
    console.log(
      'Error: onProjectNotificationDateSet projection failed to retrieve project from db',
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
      'Error: onProjectNotificationDateSet projection failed to update project',
      event,
      e.message
    )
  }
}
