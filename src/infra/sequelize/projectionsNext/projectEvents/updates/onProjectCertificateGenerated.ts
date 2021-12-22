import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectCertificateGenerated } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectCertificateGenerated,
  async ({ payload: { projectId, certificateFileId }, occurredAt }) => {
    await ProjectEvent.findOrCreate({
      where: {
        projectId,
        type: ProjectCertificateGenerated.type,
        valueDate: occurredAt.getTime(),
      },
      defaults: {
        id: new UniqueEntityID().toString(),
        payload: { certificateFileId },
      },
    })
  }
)
