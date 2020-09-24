import { EventStore } from '../../../../modules/eventStore'
import { ProjectGFDueDateSet } from '../../../../modules/project/events'

export const onProjectGFDueDateSet = (eventStore: EventStore, models) => {
  const ProjectModel = models.Project

  eventStore.subscribe(
    ProjectGFDueDateSet.type,
    async (event: ProjectGFDueDateSet) => {
      const projectInstance = await ProjectModel.findByPk(
        event.payload.projectId
      )

      if (!projectInstance) {
        console.log(
          'Error: onProjectGFDueDateSet projection failed to retrieve project from db',
          event
        )
        return
      }

      // update garantiesFinancieresDueOn
      projectInstance.garantiesFinancieresDueOn =
        event.payload.garantiesFinancieresDueOn

      try {
        await projectInstance.save()
      } catch (e) {
        console.log(
          'Error: onProjectGFDueDateSet projection failed to update project',
          event,
          e.message
        )
      }
    }
  )
}
