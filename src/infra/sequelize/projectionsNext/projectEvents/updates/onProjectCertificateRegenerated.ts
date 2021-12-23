import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectCertificateRegenerated } from '../../../../../modules/project'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  ProjectCertificateRegenerated,
  async ({ payload: { projectId, certificateFileId }, occurredAt }) => {
    await ProjectEvent.findOrCreate({
      where: {
        projectId,
        type: ProjectCertificateRegenerated.type,
        valueDate: occurredAt.getTime(),
      },
      defaults: {
        id: new UniqueEntityID().toString(),
        payload: { certificateFileId },
      },
    })
  }
)
