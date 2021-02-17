import { DomainError, UniqueEntityID } from '../../../core/domain'
import { errAsync, okAsync, ResultAsync } from '../../../core/utils'
import { makeUser } from '../../../entities'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { InfraNotAvailableError, UnauthorizedError } from '../../shared'
import { Project } from '../Project'
import { makeRegenerateCertificatesForPeriode } from './regenerateCertificatesForPeriode'

describe('regenerateCertificatesForPeriode', () => {
  const appelOffreId = 'appelOffreId'
  const periodeId = 'periodeId'
  const reason = 'reason'

  describe('when user is admin', () => {
    const user = makeUser(makeFakeUser({ role: 'admin' })).unwrap()

    describe('in general', () => {
      const projectId1 = new UniqueEntityID().toString()
      const projectId2 = new UniqueEntityID().toString()

      const getProjectIdsForPeriode = jest.fn(
        (args: { appelOffreId; periodeId }): ResultAsync<string[], InfraNotAvailableError> =>
          args.appelOffreId === appelOffreId && args.periodeId === periodeId
            ? okAsync([projectId1, projectId2])
            : errAsync(new InfraNotAvailableError())
      )
      const generateCertificate = jest.fn((projectId: string, reason: string) =>
        errAsync<null, DomainError>(new InfraNotAvailableError())
      )
      const projectRepo = {
        transaction: jest.fn(),
      }

      const regenerateCertificatesForPeriode = makeRegenerateCertificatesForPeriode({
        getProjectIdsForPeriode,
        projectRepo,
        generateCertificate,
      })

      it('should call generateCertificate for each project from this periode', async () => {
        const res = await regenerateCertificatesForPeriode({
          appelOffreId,
          periodeId,
          user,
          reason,
        })

        expect(res.isOk()).toBe(true)

        expect(generateCertificate).toHaveBeenCalledTimes(2)
        expect(generateCertificate).toHaveBeenCalledWith(projectId1, 'reason')
        expect(generateCertificate).toHaveBeenCalledWith(projectId2, 'reason')

        expect(projectRepo.transaction).not.toHaveBeenCalled()
      })
    })

    describe('when a new notification date is given', () => {
      const projectId = new UniqueEntityID().toString()
      const fakeProject = { ...makeFakeProject(), id: new UniqueEntityID(projectId) }

      const getProjectIdsForPeriode = jest.fn(
        (args: { appelOffreId; periodeId }): ResultAsync<string[], InfraNotAvailableError> =>
          args.appelOffreId === appelOffreId && args.periodeId === periodeId
            ? okAsync([projectId])
            : errAsync(new InfraNotAvailableError())
      )
      const generateCertificate = jest.fn((projectId: string, reason: string) =>
        errAsync<null, DomainError>(new InfraNotAvailableError())
      )

      const projectRepo = fakeTransactionalRepo(fakeProject as Project)

      const regenerateCertificatesForPeriode = makeRegenerateCertificatesForPeriode({
        getProjectIdsForPeriode,
        projectRepo,
        generateCertificate,
      })

      it('should update the notification date for each project from this periode', async () => {
        const res = await regenerateCertificatesForPeriode({
          appelOffreId,
          periodeId,
          user,
          reason,
          newNotifiedOn: 123,
        })

        expect(res.isOk()).toBe(true)

        expect(fakeProject.setNotificationDate).toHaveBeenCalledTimes(1)
        expect(fakeProject.setNotificationDate).toHaveBeenCalledWith(user, 123)
      })
    })
  })

  describe('when user is not admin', () => {
    const user = makeUser(makeFakeUser({ role: 'porteur-projet' })).unwrap()

    const getProjectIdsForPeriode = jest.fn()
    const generateCertificate = jest.fn()
    const projectRepo = {
      transaction: jest.fn(),
    }

    const regenerateCertificatesForPeriode = makeRegenerateCertificatesForPeriode({
      getProjectIdsForPeriode,
      projectRepo,
      generateCertificate,
    })

    it('should return a UnauthorizedError', async () => {
      const res = await regenerateCertificatesForPeriode({
        appelOffreId,
        periodeId,
        user,
        reason,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
    })
  })
})
