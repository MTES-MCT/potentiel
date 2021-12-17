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
  const date = new Date()

  beforeAll(async () => {
    await resetDatabase()

    await onProjectCertificateGenerated(
      new ProjectCertificateGenerated({
        payload: {
          projectId,
          certificateFileId: 'file-id',
        } as ProjectCertificateGeneratedPayload,
      })
    )
  })

  it('should create a new project event of type ProjectCertificateGenerated', async () => {
    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()
    expect(projectEvent).toMatchObject({
      type: 'ProjectCertificateGenerated',
      payload: { certificateFileId: 'file-id' },
    })
  })
})
