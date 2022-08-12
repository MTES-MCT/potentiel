import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'
import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectNotificationDateSet } from '../../../../../modules/project'

export default ProjectEventProjector.on(
  ProjectNotificationDateSet,
  async ({ payload: { projectId, notifiedOn }, occurredAt }, transaction) => {
    await ProjectEvent.create(
      {
        projectId,
        id: new UniqueEntityID().toString(),
        type: ProjectNotificationDateSet.type,
        valueDate: notifiedOn,
        eventPublishedAt: occurredAt.getTime(),
      },
      { transaction }
    )
  }
)
