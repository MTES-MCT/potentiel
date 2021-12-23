import { UniqueEntityID } from '../../../../../core/domain'
import {
  ProjectCertificateRegenerated,
  ProjectCertificateRegeneratedPayload,
} from '../../../../../modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectCertificateRegenerated from './onProjectCertificateRegenerated'

describe('onProjectCertificateRegenerated', () => {
  const projectId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of type ProjectCertificateRegenerated', async () => {
    await onProjectCertificateRegenerated(
      new ProjectCertificateRegenerated({
        payload: {
          projectId,
          certificateFileId: 'file-id',
        } as ProjectCertificateRegeneratedPayload,
      })
    )

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()

    expect(projectEvent).toMatchObject({
      type: 'ProjectCertificateRegenerated',
      payload: { certificateFileId: 'file-id' },
    })
  })

  describe(`when the event already exists in the projection`, () => {
    it('should not create a new project event of type ProjectCertificateRegenerated', async () => {
      const eventDate = new Date('2021-12-15')

      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'ProjectCertificateRegenerated',
        valueDate: eventDate.getTime(),
      })

      await onProjectCertificateRegenerated(
        new ProjectCertificateRegenerated({
          payload: {
            projectId,
          } as ProjectCertificateRegeneratedPayload,
          original: {
            occurredAt: eventDate,
            version: 1,
          },
        })
      )

      const projectEvents = await ProjectEvent.findAll({
        where: { projectId, type: 'ProjectCertificateRegenerated', valueDate: eventDate.getTime() },
      })

      expect(projectEvents).toHaveLength(1)
    })
  })
})
