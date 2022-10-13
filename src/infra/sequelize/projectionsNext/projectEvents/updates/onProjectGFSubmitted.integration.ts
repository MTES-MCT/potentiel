import { UniqueEntityID } from '@core/domain'
import { ProjectGFSubmitted, ProjectGFSubmittedPayload } from '@modules/project'
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
  const expirationDate = new Date('2025-01-01')

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

      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        type: 'GarantiesFinancières',
        projectId,
        valueDate: new Date('2020-01-01').getTime(),
        eventPublishedAt: new Date('2020-01-01').getTime(),
        payload: { statut: 'due' },
      })

      await onProjectGFSubmitted(
        new ProjectGFSubmitted({
          payload: {
            projectId,
            fileId,
            submittedBy,
            gfDate,
            expirationDate,
          } as ProjectGFSubmittedPayload,
          original: {
            version: 1,
            occurredAt,
          },
        })
      )

      const projectEvent = await ProjectEvent.findOne({
        where: { type: 'GarantiesFinancières', projectId },
      })

      expect(projectEvent).not.toBeNull()
      expect(projectEvent).toMatchObject({
        type: 'GarantiesFinancières',
        valueDate: gfDate.getTime(),
        eventPublishedAt: occurredAt.getTime(),
        payload: { statut: 'pending-validation' },
      })
    })
  })
})
