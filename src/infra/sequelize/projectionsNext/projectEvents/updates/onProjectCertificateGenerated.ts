import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectCertificateGenerated } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectCertificateGenerated,
  async ({ payload: { projectId, certificateFileId }, occurredAt }) => {
    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      projectId,
      type: ProjectCertificateGenerated.type,
      payload: { certificateFileId },
      valueDate: occurredAt.getTime(),
    })
  }
)
