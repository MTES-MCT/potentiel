import { EventStore } from '../../../modules/eventStore'
import { ProjectNotified } from '../../../modules/project/events'

export const initProjectProjections = (eventStore: EventStore, models) => {
  const ProjectModel = models.Project

  if (!ProjectModel) {
    console.log('Fatal Error : ProjectProjections could not init ProjectModel')
    process.exit(1)
  }

  eventStore.subscribe(ProjectNotified.type, async (event: ProjectNotified) => {
    const projectInstance = await ProjectModel.findById(event.payload.projectId)

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
  })
}
