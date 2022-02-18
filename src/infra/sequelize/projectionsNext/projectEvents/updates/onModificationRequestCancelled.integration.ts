import { resetDatabase } from '../../../helpers'
import { UniqueEntityID } from '@core/domain'
import { ModificationRequestCancelled } from '@modules/modificationRequest'
import { ProjectEvent } from '..'
import models from '../../../models'
import onModificationRequestCancelled from './onModificationRequestCancelled'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import makeFakeModificationRequest from '../../../../../__tests__/fixtures/modificationRequest'

const { ModificationRequest, Project } = models

describe('onModificationRequestCancelled', () => {
  const projectId = new UniqueEntityID().toString()
  const modificationRequestId = new UniqueEntityID().toString()
  const adminId = new UniqueEntityID().toString()
  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of ModificationRequestCancelled type', async () => {
    await Project.create(makeFakeProject({ id: projectId }))
    await ModificationRequest.create(
      makeFakeModificationRequest({ id: modificationRequestId, projectId })
    )
    await onModificationRequestCancelled(
      new ModificationRequestCancelled({
        payload: {
          modificationRequestId,
          cancelledBy: adminId,
        },
        original: {
          version: 1,
          occurredAt: new Date('2022-02-09'),
        },
      })
    )
    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })
    expect(projectEvent).toMatchObject({
      type: 'ModificationRequestCancelled',
      projectId,
      payload: { modificationRequestId },
    })
  })
})
