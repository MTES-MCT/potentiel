import { UniqueEntityID } from '../../../../../core/domain'
import {
  ProjectCertificateGenerated,
  ProjectCertificateGeneratedPayload,
} from '../../../../../modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectCertificateGenerated from './onProjectCertificateGenerated'

describe('onProjectCertificateGenerated', () => {
  const projectId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of type ProjectCertificateGenerated', async () => {
    await onProjectCertificateGenerated(
      new ProjectCertificateGenerated({
        payload: {
          projectId,
          certificateFileId: 'file-id',
        } as ProjectCertificateGeneratedPayload,
      })
    )

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()
    expect(projectEvent).toMatchObject({
      type: 'ProjectCertificateGenerated',
      payload: { certificateFileId: 'file-id' },
    })
  })

  describe(`when the event already exists in the projection`, () => {
    it('should not create a new project event of type ProjectCertificateGenerated', async () => {
      const eventDate = new Date('2021-12-15')

      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'ProjectCertificateGenerated',
        valueDate: eventDate.getTime(),
      })

      await onProjectCertificateGenerated(
        new ProjectCertificateGenerated({
          payload: {
            projectId,
          } as ProjectCertificateGeneratedPayload,
          original: {
            occurredAt: eventDate,
            version: 1,
          },
        })
      )

      const projectEvents = await ProjectEvent.findAll({
        where: { projectId, type: 'ProjectCertificateGenerated', valueDate: eventDate.getTime() },
      })

      expect(projectEvents).toHaveLength(1)
    })
  })
})
