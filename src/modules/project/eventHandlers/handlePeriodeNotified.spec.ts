import { DomainError, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { ProjectAppelOffre } from '@entities'
import { GetProjectAppelOffre } from '@modules/projectAppelOffre'
import { User } from 'src/modules/users'
import {
  fakeTransactionalRepo,
  makeFakeProject,
  makeFakeUser,
} from '../../../__tests__/fixtures/aggregates'
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

  const fakeGenerateCertificate = jest.fn(() => okAsync<null, DomainError>(null))
  const fakeGetProjectAppelOffre: GetProjectAppelOffre = ({ appelOffreId, periodeId, familleId }) =>
    ({
      id: appelOffreId,
      periode: {
        id: periodeId,
      },
      ...(familleId && { famille: { id: familleId } }),
    } as ProjectAppelOffre)

  const fakeProject = { ...makeFakeProject(), id: new UniqueEntityID('project1') }

  const projectRepo = fakeTransactionalRepo(fakeProject as Project)

  beforeAll(async () => {
    await handlePeriodeNotified({
      getUnnotifiedProjectsForPeriode,
      projectRepo,
      generateCertificate: fakeGenerateCertificate,
      getProjectAppelOffre: fakeGetProjectAppelOffre,
    })(
      new PeriodeNotified({
        payload: { ...fakePayload, requestedBy: 'user1' },
        requestId: 'request1',
      })
    )
  })

  it('should call Project.notify() on each unnotified project', () => {
    expect(fakeProject.notify).toHaveBeenCalledWith({
      appelOffre: {
        id: fakePayload.appelOffreId,
        periode: { id: fakePayload.periodeId },
        famille: { id: fakePayload.familleId },
      },
      notifiedOn: 1,
    })
  })

  it('should call generateCertificate() on each unnotified project', () => {
    expect(fakeGenerateCertificate).toHaveBeenCalledWith({
      projectId: 'project1',
      validateurId: 'user1',
    })
  })
})
