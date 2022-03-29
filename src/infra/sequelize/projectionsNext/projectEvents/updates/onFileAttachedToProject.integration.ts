import { UniqueEntityID } from '@core/domain'
import { FileAttachedToProject } from '../../../../../modules/file'
import makeFakeUser from '../../../../../__tests__/fixtures/user'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { ProjectEvent } from '../projectEvent.model'
import onFileAttachedToProject from './onFileAttachedToProject'

const { User, UserDreal } = models

describe('onFileAttachedToProject', () => {
  const projectId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()
  const attachedBy = new UniqueEntityID().toString()
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

  beforeAll(async () => {
    await resetDatabase()

    await User.create(makeFakeUser({ id: attachedBy, role: 'dgec', fullName: 'John Doe' }))
    await onFileAttachedToProject(event)
  })

  it('should create a new project event of type FileAttachedToProject', async () => {
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
        attachedBy: {
          id: attachedBy,
          name: 'John Doe',
          administration: 'DGEC',
        },
      },
    })
  })

  describe('when the user is dreal', () => {
    beforeAll(async () => {
      await resetDatabase()
      await User.create(makeFakeUser({ id: attachedBy, role: 'dreal', fullName: 'John Doe' }))
      await UserDreal.create({ dreal: 'PACA', userId: attachedBy })

      await onFileAttachedToProject(event)
    })

    it('should include the dreal region', async () => {
      const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

      expect(projectEvent).not.toBeNull()
      expect(projectEvent).toMatchObject({
        payload: {
          attachedBy: {
            id: attachedBy,
            name: 'John Doe',
            administration: 'DREAL PACA',
          },
        },
      })
    })
  })
})
