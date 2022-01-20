import { DomainError, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { InfraNotAvailableError } from '../../shared'
import { PeriodeNotified } from '../events'
import { Project } from '../Project'
import { UnnotifiedProjectDTO } from '../queries'
import { handlePeriodeNotified } from './'

describe('handlePeriodeNotified', () => {
  const getUnnotifiedProjectsForPeriode = jest.fn((appelOffreId: string, periodeId: string) =>
    okAsync<UnnotifiedProjectDTO[], InfraNotAvailableError>(
      ['project1'].map((projectId) => ({
        projectId,
        candidateEmail: 'email',
        candidateName: 'john doe',
        familleId: 'famille',
      }))
    )
  )

  const fakePayload = {
    periodeId: 'periode1',
    familleId: 'famille',
    appelOffreId: 'appelOffre1',
    notifiedOn: 1,
  }

  const fakeGenerateCertificate = jest.fn((projectId: string) => okAsync<null, DomainError>(null))

  const fakeProject = { ...makeFakeProject(), id: new UniqueEntityID('project1') }

  const projectRepo = fakeTransactionalRepo(fakeProject as Project)

  beforeAll(async () => {
    await handlePeriodeNotified({
      getUnnotifiedProjectsForPeriode,
      projectRepo,
      generateCertificate: fakeGenerateCertificate,
    })(
      new PeriodeNotified({
        payload: { ...fakePayload, requestedBy: 'user1' },
        requestId: 'request1',
      })
    )
  })

  it('should call Project.notify() on each unnotified project', () => {
    expect(fakeProject.notify).toHaveBeenCalledWith(1)
  })

  it('should call generateCertificate() on each unnotified project', () => {
    expect(fakeGenerateCertificate).toHaveBeenCalledWith('project1')
  })
})
