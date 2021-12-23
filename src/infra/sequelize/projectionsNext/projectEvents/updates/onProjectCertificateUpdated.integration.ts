import { UniqueEntityID } from '../../../../../core/domain'
import {
  ProjectCertificateUpdated,
  ProjectCertificateUpdatedPayload,
} from '../../../../../modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectCertificateUpdated from './onProjectCertificateUpdated'

describe('onProjectCertificateUpdated', () => {
  const projectId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of type ProjectCertificateUpdated', async () => {
    await onProjectCertificateUpdated(
      new ProjectCertificateUpdated({
        payload: {
          projectId,
          certificateFileId: 'file-id',
        } as ProjectCertificateUpdatedPayload,
      })
    )

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()
    expect(projectEvent).toMatchObject({
      type: 'ProjectCertificateUpdated',
      payload: { certificateFileId: 'file-id' },
    })
  })

  describe(`when the event already exists in the projection`, () => {
    it('should not create a new project event of type ProjectCertificateUpdated', async () => {
      const eventDate = new Date('2021-12-15')

      await ProjectEvent.create({
        id: new UniqueEntityID().toString(),
        projectId,
        type: 'ProjectCertificateUpdated',
        valueDate: eventDate.getTime(),
      })

      await onProjectCertificateUpdated(
        new ProjectCertificateUpdated({
          payload: {
            projectId,
          } as ProjectCertificateUpdatedPayload,
          original: {
            occurredAt: eventDate,
            version: 1,
          },
        })
      )

      const projectEvents = await ProjectEvent.findAll({
        where: { projectId, type: 'ProjectCertificateUpdated', valueDate: eventDate.getTime() },
      })

      expect(projectEvents).toHaveLength(1)
    })
  })
})
