import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectCertificateUpdated } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectCertificateUpdated,
  async ({ payload: { projectId, certificateFileId }, occurredAt }) => {
    await ProjectEvent.findOrCreate({
      where: {
        projectId,
        type: ProjectCertificateUpdated.type,
        valueDate: occurredAt.getTime(),
        eventPublishedAt: occurredAt.getTime(),
      },
      defaults: { id: new UniqueEntityID().toString(), payload: { certificateFileId } },
    })
  }
)
