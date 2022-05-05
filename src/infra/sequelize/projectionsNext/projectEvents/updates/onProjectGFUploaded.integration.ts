import { UniqueEntityID } from '@core/domain'
import { ProjectGFUploaded, ProjectGFUploadedPayload } from '@modules/project'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { ProjectEvent } from '../projectEvent.model'
import onProjectGFUploaded from './onProjectGFUploaded'

describe('onProjectGFUploaded', () => {
  const { File, User } = models
  const projectId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()
  const occurredAt = new Date('2022-01-04')
  const gfDate = new Date('2021-12-26')
  const filename = 'my-file'
  const expirationDate = new Date('2025-01-01')
  const userId = new UniqueEntityID().toString()
  const role = 'porteur-projet'

  beforeEach(async () => {
    await resetDatabase()
  })

  describe('when there is a corresponding file is the File projection', () => {
    it('should create a new project event of type ProjectGFUploaded', async () => {
      await File.create({
        id: fileId,
        filename,
        designation: 'garantie-financiere-ppe2',
      })

      await User.create({
        id: userId,
        fullName: 'userName',
        email: 'email@test.test',
        role,
      })

      await onProjectGFUploaded(
        new ProjectGFUploaded({
          payload: {
            projectId,
            fileId,
            submittedBy: userId,
            gfDate,
            expirationDate,
          } as ProjectGFUploadedPayload,
          original: {
            version: 1,
            occurredAt,
          },
        })
      )

      const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

      expect(projectEvent).not.toBeNull()
      expect(projectEvent).toMatchObject({
        type: 'ProjectGFUploaded',
        valueDate: gfDate.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        payload: {
          file: { id: fileId, name: filename },
          expirationDate: expirationDate.getTime(),
          uploadedByRole: role,
        },
      })
    })
  })
  describe('when there is no corresponding file is the File projection', () => {
    it('should still add a new event in ProjectEvent', async () => {
      await onProjectGFUploaded(
        new ProjectGFUploaded({
          payload: {
            projectId,
            fileId,
            submittedBy: userId,
            gfDate,
          } as ProjectGFUploadedPayload,
          original: {
            version: 1,
            occurredAt,
          },
        })
      )

      const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

      expect(projectEvent).not.toBeNull()
      expect(projectEvent).toMatchObject({
        type: 'ProjectGFUploaded',
        valueDate: gfDate.getTime(),
        eventPublishedAt: occurredAt.getTime(),
      })
    })
  })
})
