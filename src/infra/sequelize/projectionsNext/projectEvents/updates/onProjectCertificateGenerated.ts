import { UniqueEntityID } from '@core/domain'
import { ProjectCertificateGenerated } from '@modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectCertificateGenerated,
  async ({ payload: { projectId, certificateFileId }, occurredAt }, transaction) => {
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectCertificateGenerated.type,
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { certificateFileId },
      },
      { transaction }
    )
  }
)
