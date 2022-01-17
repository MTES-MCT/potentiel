import models from '../../../models'
import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectPTFSubmitted, ProjectPTFSubmittedPayload } from '../../../../../modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectPTFSubmitted from './onProjectPTFSubmitted'

const { File } = models

describe('onProjectPTFSubmitted', () => {
  const projectId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()
  const occurredAt = new Date('2022-01-04')
  const submittedBy = 'user-id'
  const ptfDate = new Date('2021-12-26')
  const filename = 'my-file'

  beforeEach(async () => {
    await resetDatabase()
  })

  describe(`when the file does not exists`, () => {
    it('should create a new project event of type ProjectPTFSubmitted', async () => {
      await onProjectPTFSubmitted(
        new ProjectPTFSubmitted({
          payload: {
            projectId,
            fileId,
            submittedBy,
            ptfDate,
          } as ProjectPTFSubmittedPayload,
          original: {
            version: 1,
            occurredAt,
          },
        })
      )

      const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

      expect(projectEvent).not.toBeNull()
      expect(projectEvent).toMatchObject({
        projectId,
        type: 'ProjectPTFSubmitted',
        valueDate: ptfDate.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        payload: { fileId },
      })
    })
  })

  describe(`when the file does not exists`, () => {
    it('should create a new project event of type ProjectPTFSubmitted', async () => {
      await File.create({
        id: fileId,
        filename,
        designation: 'ptf',
      })

      await onProjectPTFSubmitted(
        new ProjectPTFSubmitted({
          payload: {
            projectId,
            fileId,
            submittedBy,
            ptfDate,
          } as ProjectPTFSubmittedPayload,
          original: {
            version: 1,
            occurredAt,
          },
        })
      )

      const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

      expect(projectEvent).not.toBeNull()
      expect(projectEvent).toMatchObject({
        projectId,
        type: 'ProjectPTFSubmitted',
        valueDate: ptfDate.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        payload: { fileId, filename },
      })
    })
  })
})
