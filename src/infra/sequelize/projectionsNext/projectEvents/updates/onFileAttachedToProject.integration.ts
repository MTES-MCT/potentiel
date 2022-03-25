import { UniqueEntityID } from '@core/domain'
import { FileAttachedToProject } from '../../../../../modules/file'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { ProjectEvent } from '../projectEvent.model'
import onFileAttachedToProject from './onFileAttachedToProject'

const { File } = models

describe('onFileAttachedToProject', () => {
  const projectId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()
  const attachedBy = 'user-id'
  const filename = 'my-file'

  const event = new FileAttachedToProject({
    payload: {
      projectId,
      date: new Date('2022-01-01').getTime(),
      title: 'title',
      description: 'description',
      files: [{ id: fileId, name: filename }],
      attachedBy,
    },
  })

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of type FileAttachedToProject', async () => {
    await onFileAttachedToProject(event)

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()
    expect(projectEvent).toMatchObject({
      projectId,
      type: 'FileAttachedToProject',
      eventPublishedAt: event.occurredAt.getTime(),
      valueDate: new Date('2022-01-01').getTime(),
      payload: {
        title: 'title',
        description: 'description',
        files: [{ id: fileId, name: filename }],
        attachedBy,
      },
    })
  })
})
