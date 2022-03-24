import { DomainError, UniqueEntityID } from '@core/domain'
import { okAsync } from 'neverthrow'
import { ProjectCertificateObsolete } from '../events'
import { handleProjectCertificateObsolete } from './handleProjectCertificateObsolete'

describe('handleProjectCertificateObsolete', () => {
  const projectId = new UniqueEntityID().toString()
  const fakeGenerateCertificate = jest.fn((projectId: string) => okAsync<null, DomainError>(null))

  beforeAll(async () => {
    await handleProjectCertificateObsolete({
      generateCertificate: fakeGenerateCertificate,
    })(
      new ProjectCertificateObsolete({
        payload: {
          projectId,
        },
      })
    )
  })

  it('should generate a new certificate', () => {
    expect(fakeGenerateCertificate).toHaveBeenCalledWith(projectId, 'certificate-obsolete')
  })
})
