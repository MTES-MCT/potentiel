import { UniqueEntityID } from '@core/domain'
import { ProjectCertificateUpdated } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  ProjectCertificateUpdated,
  async ({ payload: { projectId, certificateFileId }, occurredAt }, transaction) => {
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectCertificateUpdated.type,
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { certificateFileId },
      },
      { transaction }
    )
  }
)
