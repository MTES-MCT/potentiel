import { resetDatabase } from '../../../helpers'
import { UniqueEntityID } from '@core/domain'
import {
  ModificationRequestAccepted,
  ModificationRequestAcceptedPayload,
} from '@modules/modificationRequest'
import { ProjectEvent } from '..'
import models from '../../../models'
import onModificationRequestAccepted from './onModificationRequestAccepted'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import makeFakeModificationRequest from '../../../../../__tests__/fixtures/modificationRequest'
import makeFakeFile from '../../../../../__tests__/fixtures/file'

const { ModificationRequest, Project, File } = models

describe('onModificationRequestAccepted', () => {
  const projectId = new UniqueEntityID().toString()
  const modificationRequestId = new UniqueEntityID().toString()
  const adminId = new UniqueEntityID().toString()
  beforeEach(async () => {
    await resetDatabase()
  })

  describe('when there is no response file', () => {
    it('should create a new project event of ModificationAccepted type', async () => {
      await Project.create(makeFakeProject({ id: projectId }))
      await ModificationRequest.create(
        makeFakeModificationRequest({ id: modificationRequestId, projectId })
      )
      await onModificationRequestAccepted(
        new ModificationRequestAccepted({
          payload: {
            modificationRequestId,
            acceptedBy: adminId,
          } as ModificationRequestAcceptedPayload,
          original: {
            version: 1,
            occurredAt: new Date('2022-02-09'),
          },
        })
      )
      const projectEvent = await ProjectEvent.findOne({ where: { projectId } })
      expect(projectEvent).toMatchObject({
        type: 'ModificationRequestAccepted',
        projectId,
        payload: { modificationRequestId, file: {} },
      })
    })
  })

  describe('when there is a response file', () => {
    it('should create a new project event of ModificationAccepted type', async () => {
      const fileId = new UniqueEntityID().toString()
      await Project.create(makeFakeProject({ id: projectId }))
      await File.create(makeFakeFile({ id: fileId, filename: 'filename' }))
      await ModificationRequest.create(
        makeFakeModificationRequest({ id: modificationRequestId, projectId })
      )
      await onModificationRequestAccepted(
        new ModificationRequestAccepted({
          payload: {
            modificationRequestId,
            acceptedBy: adminId,
            responseFileId: fileId,
          } as ModificationRequestAcceptedPayload,
          original: {
            version: 1,
            occurredAt: new Date('2022-02-09'),
          },
        })
      )
      const projectEvent = await ProjectEvent.findOne({ where: { projectId } })
      expect(projectEvent).toMatchObject({
        type: 'ModificationRequestAccepted',
        projectId,
        payload: { modificationRequestId, file: { name: 'filename', id: fileId } },
      })
    })
  })
})
