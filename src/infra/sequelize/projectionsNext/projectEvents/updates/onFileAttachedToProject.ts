import { Payload } from 'aws-sdk/clients/iotdata'
import { FileAttachedToProject } from '../../../../../modules/file'
import models from '../../../models'
import { ProjectEvent } from '../projectEvent.model'

export default ProjectEvent.projector.on(
  FileAttachedToProject,
  async ({ payload: { projectId, date, attachedBy, ...payload }, occurredAt, id }, transaction) => {
    const { User, UserDreal } = models
    const user = await User.findOne({ where: { id: attachedBy }, transaction })

    const attachedByUser: any = { id: attachedBy }
    if (user) {
      attachedByUser.name = user.fullName

      if (user.role === 'dgec' || user.role === 'admin') {
        attachedByUser.administration = 'DGEC'
      }

      if (user.role === 'dreal') {
        const region = await UserDreal.findOne({ where: { userId: attachedBy }, transaction })
        if (region) {
          attachedByUser.administration = `DREAL ${region.dreal}`
        }
      }
    }

    await ProjectEvent.create(
      {
        projectId,
        type: FileAttachedToProject.type,
        valueDate: date,
        eventPublishedAt: occurredAt.getTime(),
        id,
        payload: { ...payload, attachmentId: id, attachedBy: attachedByUser },
      },
      { transaction }
    )
  }
)
