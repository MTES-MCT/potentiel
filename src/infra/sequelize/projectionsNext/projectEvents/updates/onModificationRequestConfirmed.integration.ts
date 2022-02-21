import { resetDatabase } from '../../../helpers'
import { UniqueEntityID } from '@core/domain'
import {
  ModificationRequestConfirmed,
  ModificationRequestConfirmedPayload,
} from '@modules/modificationRequest'
import { ProjectEvent } from '..'
import models from '../../../models'
import onModificationRequestConfirmed from './onModificationRequestConfirmed'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import makeFakeModificationRequest from '../../../../../__tests__/fixtures/modificationRequest'

const { ModificationRequest, Project } = models

describe('onModificationRequestConfirmed', () => {
  const projectId = new UniqueEntityID().toString()
  const modificationRequestId = new UniqueEntityID().toString()
  const adminId = new UniqueEntityID().toString()
  beforeEach(async () => {
    await resetDatabase()
  })

  describe('when there is a ModificationRequestConfirmed event published', () => {
    it('should create a new project event of type ModificationRequestConfirmed', async () => {
      await Project.create(makeFakeProject({ id: projectId }))
      await ModificationRequest.create(
        makeFakeModificationRequest({ id: modificationRequestId, projectId })
      )
      await onModificationRequestConfirmed(
        new ModificationRequestConfirmed({
          payload: {
            modificationRequestId,
            confirmedBy: adminId,
          } as ModificationRequestConfirmedPayload,
          original: {
            version: 1,
            occurredAt: new Date('2022-02-09'),
          },
        })
      )
      const projectEvent = await ProjectEvent.findOne({ where: { projectId } })
      expect(projectEvent).toMatchObject({
        type: 'ModificationRequestConfirmed',
        projectId,
        payload: { modificationRequestId },
      })
    })
  })
})
