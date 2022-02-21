import { resetDatabase } from '../../../helpers'
import { UniqueEntityID } from '@core/domain'
import { ConfirmationRequested } from '@modules/modificationRequest'
import { ProjectEvent } from '..'
import models from '../../../models'
import onConfirmationRequested from './onConfirmationRequested'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import makeFakeModificationRequest from '../../../../../__tests__/fixtures/modificationRequest'
import makeFakeFile from '../../../../../__tests__/fixtures/file'

const { ModificationRequest, Project, File } = models

describe('onConfirmationRequested', () => {
  const projectId = new UniqueEntityID().toString()
  const modificationRequestId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()
  const adminId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of ConfirmationRequested type', async () => {
    await Project.create(makeFakeProject({ id: projectId }))
    await ModificationRequest.create(
      makeFakeModificationRequest({ id: modificationRequestId, projectId })
    )
    await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))

    await onConfirmationRequested(
      new ConfirmationRequested({
        payload: {
          modificationRequestId,
          confirmationRequestedBy: adminId,
          responseFileId: fileId,
        },
        original: {
          version: 1,
          occurredAt: new Date('2022-02-09'),
        },
      })
    )
    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })
    expect(projectEvent).toMatchObject({
      type: 'ConfirmationRequested',
      projectId,
      payload: { modificationRequestId, file: { name: 'filename', id: fileId } },
    })
  })
})
