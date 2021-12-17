import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectCertificateUpdated } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectCertificateUpdated,
  async ({ payload: { projectId, certificateFileId }, occurredAt }) => {
    await ProjectEvent.create({
      id: new UniqueEntityID().toString(),
      projectId,
      type: ProjectCertificateUpdated.type,
      payload: { certificateFileId },
      valueDate: occurredAt.getTime(),
    })
  }
)
