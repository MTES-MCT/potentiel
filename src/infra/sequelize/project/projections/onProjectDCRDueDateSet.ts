import { EventStore } from '../../../../modules/eventStore'
import { ProjectDCRDueDateSet } from '../../../../modules/project/events'

export const onProjectDCRDueDateSet = (models) => async (
  event: ProjectDCRDueDateSet
) => {
  const ProjectModel = models.Project
  const projectInstance = await ProjectModel.findByPk(event.payload.projectId)

  if (!projectInstance) {
    console.log(
      'Error: onProjectDCRDueDateSet projection failed to retrieve project from db',
      event
    )
    return
  }

  // update dcrDueOn
  projectInstance.dcrDueOn = event.payload.dcrDueOn

  try {
    await projectInstance.save()
  } catch (e) {
    console.log(
      'Error: onProjectDCRDueDateSet projection failed to update project',
      event,
      e.message
    )
  }
}
