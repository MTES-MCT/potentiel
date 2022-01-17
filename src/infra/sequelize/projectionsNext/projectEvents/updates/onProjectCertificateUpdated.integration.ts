import { UniqueEntityID } from '../../../../../core/domain'
import { ProjectCertificateUpdated, ProjectCertificateUpdatedPayload } from '@modules/project'
import { resetDatabase } from '../../../helpers'
import { ProjectEvent } from '../projectEvent.model'
import onProjectCertificateUpdated from './onProjectCertificateUpdated'

describe('onProjectCertificateUpdated', () => {
  const projectId = new UniqueEntityID().toString()

  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a new project event of type ProjectCertificateUpdated', async () => {
    const occurredAt = new Date('2022-01-04')

    await onProjectCertificateUpdated(
      new ProjectCertificateUpdated({
        payload: {
          projectId,
          certificateFileId: 'file-id',
        } as ProjectCertificateUpdatedPayload,
        original: {
          version: 1,
          occurredAt,
        },
      })
    )

    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()
    expect(projectEvent).toMatchObject({
      type: 'ProjectCertificateUpdated',
      valueDate: occurredAt.getTime(),
      eventPublishedAt: occurredAt.getTime(),
      payload: { certificateFileId: 'file-id' },
    })
  })
})
