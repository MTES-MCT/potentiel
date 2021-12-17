import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectCertificateRegenerated } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectCertificateRegenerated,
  async ({ payload: { projectId, certificateFileId }, occurredAt }) => {
    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      projectId,
      type: ProjectCertificateRegenerated.type,
      payload: { certificateFileId },
      valueDate: occurredAt.getTime(),
    })
  }
)
