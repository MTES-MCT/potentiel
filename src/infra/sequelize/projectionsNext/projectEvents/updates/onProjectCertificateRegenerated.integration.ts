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

  beforeAll(async () => {
    await resetDatabase()

    await onProjectCertificateRegenerated(
      new ProjectCertificateRegenerated({
        payload: {
          projectId,
          certificateFileId: 'file-id',
        } as ProjectCertificateRegeneratedPayload,
      })
    )
  })

  it('should create a new project event of type ProjectCertificateRegenerated', async () => {
    const projectEvent = await ProjectEvent.findOne({ where: { projectId } })

    expect(projectEvent).not.toBeNull()

    expect(projectEvent).toMatchObject({
      type: 'ProjectCertificateRegenerated',
      payload: { certificateFileId: 'file-id' },
    })
  })
})
