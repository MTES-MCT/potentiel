import { UniqueEntityID } from '@core/domain'
import { ProjectCertificateRegenerated } from '@modules/project'
import { ProjectEvent, ProjectEventProjector } from '../projectEvent.model'

export default ProjectEventProjector.on(
  ProjectCertificateRegenerated,
  async ({ payload: { projectId, certificateFileId }, occurredAt }, transaction) => {
    await ProjectEvent.create(
      {
        projectId,
        type: ProjectCertificateRegenerated.type,
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        id: new UniqueEntityID().toString(),
        payload: { certificateFileId },
      },
      { transaction }
    )
  }
)
