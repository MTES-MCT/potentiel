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
  const date = new Date()

  beforeAll(async () => {
    await resetDatabase()

    await onProjectCertificateUpdated(
      new ProjectCertificateUpdated({
        payload: {
          projectId,
          certificateFileId: 'file-id',
        } as ProjectCertificateUpdatedPayload,
      })
    )
  })

  it('should create a new project event of type ProjectCertificateUpdated', async () => {
    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()
    expect(projectEvent).toMatchObject({
      type: 'ProjectCertificateUpdated',
      payload: { certificateFileId: 'file-id' },
    })
  })
})
