import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectDCRSubmitted, ProjectDCRSubmittedPayload } from '../../../../../modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectDCRSubmitted from './onProjectDCRSubmitted'
import models from '../../../models'

describe('onProjectDCRSubmitted', () => {
  const projectId = new UniqueEntityID().toString()
  const fileId = new UniqueEntityID().toString()
  const occurredAt = new Date('2022-01-04')
  const submittedBy = 'user-id'
  const dcrDate = new Date('2021-12-26')
  const filename = 'my-file'
  const { File } = models
  const numeroDossier = 'DOSSIER-1'

  beforeEach(async () => {
    await resetDatabase()
  })

  describe('when there is a corresponding file in File projection', () => {
    it('should create a new project event of type ProjectDCRSubmitted', async () => {
      await File.create({
        id: fileId,
        filename,
        designation: 'designation',
      })

      await onProjectDCRSubmitted(
        new ProjectDCRSubmitted({
          payload: {
            projectId,
            fileId,
            submittedBy,
            dcrDate,
            numeroDossier,
          } as ProjectDCRSubmittedPayload,
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
        type: 'ProjectDCRSubmitted',
        valueDate: dcrDate.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        payload: { fileId, filename, numeroDossier },
      })
    })

    describe('when there is no corresponding file in File projection', () => {
      it('should not add a new event in ProjectEvent', async () => {
        await onProjectDCRSubmitted(
          new ProjectDCRSubmitted({
            payload: {
              projectId,
              fileId,
              submittedBy,
              dcrDate,
            } as ProjectDCRSubmittedPayload,
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
})
