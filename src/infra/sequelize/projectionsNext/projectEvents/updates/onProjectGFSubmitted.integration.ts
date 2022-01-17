import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectGFSubmitted, ProjectGFSubmittedPayload } from '../../../../../modules/project'
import { resetDatabase } from '../../../helpers'
import models from '../../../models'
import { ProjectEvent } from '../projectEvent.model'
import onProjectGFSubmitted from './onProjectGFSubmitted'

describe('onProjectGFSubmitted', () => {
  const { File } = models
  const projectId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()
  const occurredAt = new Date('2022-01-04')
  const submittedBy = 'user-id'
  const gfDate = new Date('2021-12-26')
  const filename = 'my-file'

  beforeEach(async () => {
    await resetDatabase()
  })

  describe('when there is a corresponding file is the File projection', () => {
    it('should create a new project event of type ProjectGFSubmitted', async () => {
      await File.create({
        id: fileId,
        filename,
        designation: 'designation',
      })

      await onProjectGFSubmitted(
        new ProjectGFSubmitted({
          payload: {
            projectId,
            fileId,
            submittedBy,
            gfDate,
          } as ProjectGFSubmittedPayload,
          original: {
            version: 1,
            occurredAt,
          },
        })
      )

      const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

      expect(projectEvent).not.toBeNull()
      expect(projectEvent).toMatchObject({
        type: 'ProjectGFSubmitted',
        valueDate: gfDate.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        payload: { fileId, filename },
      })
    })
  })
  describe('when there is a corresponding file is the File projection', () => {
    it('should not add a new event in ProjectEvent', async () => {
      await onProjectGFSubmitted(
        new ProjectGFSubmitted({
          payload: {
            projectId,
            fileId,
            submittedBy,
            gfDate,
          } as ProjectGFSubmittedPayload,
          original: {
            version: 1,
            occurredAt,
          },
        })
      )

      const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

      expect(projectEvent).toBeNull()
    })
  })
})
