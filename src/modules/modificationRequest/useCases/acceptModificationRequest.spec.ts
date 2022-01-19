import { ModificationRequest, ModificationRequestAcceptanceParams } from '../ModificationRequest'
import {
  fakeRepo,
  makeFakeModificationRequest,
  makeFakeProject,
} from '../../../__tests__/fixtures/aggregates'
import { makeAcceptModificationRequest } from './acceptModificationRequest'
import { logger, okAsync } from '@core/utils'
import { FileObject } from '../../file'
import { Repository, UniqueEntityID } from '@core/domain'
import { Readable } from 'stream'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { makeUser } from '@entities'
import { UnwrapForTest } from '../../../types'
import { Project } from '../../project/Project'
import { AggregateHasBeenUpdatedSinceError, UnauthorizedError } from '../../shared'
import { PuissanceVariationWithDecisionJusticeError } from '../errors'

describe('acceptModificationRequest use-case', () => {
  const fakeFileContents = Readable.from('test-content')
  const fakeFileName = 'myfilename.pdf'
  const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))

  describe('when user is admin', () => {
    const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))

    describe('for any type', () => {
      const fakeModificationRequest = {
        ...makeFakeModificationRequest(),
      }
      const fakeProject = {
        ...makeFakeProject(),
        id: fakeModificationRequest.projectId,
      }
      const modificationRequestRepo = fakeRepo(fakeModificationRequest as ModificationRequest)
      const projectRepo = fakeRepo(fakeProject as Project)
      const fileRepo = {
        save: jest.fn((file: FileObject) => okAsync(null)),
        load: jest.fn(),
      }

      const acceptModificationRequest = makeAcceptModificationRequest({
        modificationRequestRepo,
        projectRepo,
        fileRepo: fileRepo as Repository<FileObject>,
      })

      const acceptanceParams: ModificationRequestAcceptanceParams = {
        type: 'recours',
        newNotificationDate: new Date(1234),
      }

      beforeAll(async () => {
        const res = await acceptModificationRequest({
          modificationRequestId: fakeModificationRequest.id,
          versionDate: fakeModificationRequest.lastUpdatedOn,
          acceptanceParams,
          responseFile: { contents: fakeFileContents, filename: fakeFileName },
          submittedBy: fakeUser,
        })

        if (res.isErr()) logger.error(res.error)
        expect(res.isOk()).toEqual(true)
      })

      it('should save the response file', () => {
        expect(fileRepo.save).toHaveBeenCalled()
        expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents)
        expect(fileRepo.save.mock.calls[0][0].filename).toEqual(fakeFileName)
      })

      it('should call accept on modificationRequest', () => {
        const responseFileId = fileRepo.save.mock.calls[0][0].id.toString()
        expect(fakeModificationRequest.accept).toHaveBeenCalledTimes(1)
        expect(fakeModificationRequest.accept).toHaveBeenCalledWith({
          acceptedBy: fakeUser,
          responseFileId,
          params: acceptanceParams,
        })
      })

      it('should save the modificationRequest', () => {
        expect(modificationRequestRepo.save).toHaveBeenCalled()
        expect(modificationRequestRepo.save.mock.calls[0][0]).toEqual(fakeModificationRequest)
      })
    })

    describe('when type is recours', () => {
      const fakeModificationRequest = {
        ...makeFakeModificationRequest(),
        type: 'recours',
      }
      const fakeProject = {
        ...makeFakeProject(),
        id: fakeModificationRequest.projectId,
      }
      const modificationRequestRepo = fakeRepo(fakeModificationRequest as ModificationRequest)
      const projectRepo = fakeRepo(fakeProject as Project)
      const fileRepo = {
        save: jest.fn((file: FileObject) => okAsync(null)),
        load: jest.fn(),
      }

      const acceptModificationRequest = makeAcceptModificationRequest({
        modificationRequestRepo,
        projectRepo,
        fileRepo: fileRepo as Repository<FileObject>,
      })
      beforeAll(async () => {
        const res = await acceptModificationRequest({
          modificationRequestId: fakeModificationRequest.id,
          versionDate: fakeModificationRequest.lastUpdatedOn,
          acceptanceParams: { type: 'recours', newNotificationDate: new Date(1234) },
          responseFile: { contents: fakeFileContents, filename: fakeFileName },
          submittedBy: fakeUser,
        })

        if (res.isErr()) logger.error(res.error)
        expect(res.isOk()).toEqual(true)
      })

      it('should call grantClasse on project', () => {
        expect(fakeProject.grantClasse).toHaveBeenCalledTimes(1)
        expect(fakeProject.grantClasse.mock.calls[0][0]).toEqual(fakeUser)
      })

      it('should call updateCertificate on project', () => {
        expect(fakeProject.updateCertificate).toHaveBeenCalledTimes(1)
        expect(fakeProject.updateCertificate.mock.calls[0][0]).toEqual(fakeUser)
        expect(fakeProject.updateCertificate.mock.calls[0][1]).toHaveLength(
          new UniqueEntityID().toString().length
        )
      })

      it('should call setNotificationDate on project with the newNotificationDate', () => {
        expect(fakeProject.setNotificationDate).toHaveBeenCalledTimes(1)
        expect(fakeProject.setNotificationDate.mock.calls[0][0]).toEqual(fakeUser)
        expect(fakeProject.setNotificationDate.mock.calls[0][1]).toEqual(1234)
      })

      it('should save the project', () => {
        expect(projectRepo.save).toHaveBeenCalled()
        expect(projectRepo.save.mock.calls[0][0]).toEqual(fakeProject)
      })
    })

    describe('when type is delai', () => {
      const fakeModificationRequest = {
        ...makeFakeModificationRequest(),
        type: 'delai',
      }
      const fakeProject = {
        ...makeFakeProject(),
        id: fakeModificationRequest.projectId,
      }
      const modificationRequestRepo = fakeRepo(fakeModificationRequest as ModificationRequest)
      const projectRepo = fakeRepo(fakeProject as Project)
      const fileRepo = {
        save: jest.fn((file: FileObject) => okAsync(null)),
        load: jest.fn(),
      }

      const acceptModificationRequest = makeAcceptModificationRequest({
        modificationRequestRepo,
        projectRepo,
        fileRepo: fileRepo as Repository<FileObject>,
      })
      beforeAll(async () => {
        const res = await acceptModificationRequest({
          modificationRequestId: fakeModificationRequest.id,
          versionDate: fakeModificationRequest.lastUpdatedOn,
          acceptanceParams: { type: 'delai', delayInMonths: 2 },
          responseFile: { contents: fakeFileContents, filename: fakeFileName },
          submittedBy: fakeUser,
        })

        if (res.isErr()) logger.error(res.error)
        expect(res.isOk()).toEqual(true)
      })

      it('should call moveCompletionDueDate on project', () => {
        expect(fakeProject.moveCompletionDueDate).toHaveBeenCalledTimes(1)
        expect(fakeProject.moveCompletionDueDate).toHaveBeenCalledWith(fakeUser, 2)
      })

      it('should save the project', () => {
        expect(projectRepo.save).toHaveBeenCalled()
        expect(projectRepo.save.mock.calls[0][0]).toEqual(fakeProject)
      })
    })

    describe('when type is abandon', () => {
      const fakeModificationRequest = {
        ...makeFakeModificationRequest(),
        type: 'abandon',
      }
      const fakeProject = {
        ...makeFakeProject(),
        id: fakeModificationRequest.projectId,
      }
      const modificationRequestRepo = fakeRepo(fakeModificationRequest as ModificationRequest)
      const projectRepo = fakeRepo(fakeProject as Project)
      const fileRepo = {
        save: jest.fn((file: FileObject) => okAsync(null)),
        load: jest.fn(),
      }

      const acceptModificationRequest = makeAcceptModificationRequest({
        modificationRequestRepo,
        projectRepo,
        fileRepo: fileRepo as Repository<FileObject>,
      })
      beforeAll(async () => {
        const res = await acceptModificationRequest({
          modificationRequestId: fakeModificationRequest.id,
          versionDate: fakeModificationRequest.lastUpdatedOn,
          responseFile: { contents: fakeFileContents, filename: fakeFileName },
          submittedBy: fakeUser,
        })

        if (res.isErr()) logger.error(res.error)
        expect(res.isOk()).toEqual(true)
      })

      it('should call abandon on project', () => {
        expect(fakeProject.abandon).toHaveBeenCalledTimes(1)
        expect(fakeProject.abandon).toHaveBeenCalledWith(fakeUser)
      })

      it('should save the project', () => {
        expect(projectRepo.save).toHaveBeenCalled()
        expect(projectRepo.save.mock.calls[0][0]).toEqual(fakeProject)
      })
    })

    describe('when type is actionnaire', () => {
      const fakeModificationRequest = {
        ...makeFakeModificationRequest(),
        type: 'actionnaire',
      }
      const fakeProject = {
        ...makeFakeProject(),
        id: fakeModificationRequest.projectId,
      }
      const modificationRequestRepo = fakeRepo(fakeModificationRequest as ModificationRequest)
      const projectRepo = fakeRepo(fakeProject as Project)
      const fileRepo = {
        save: jest.fn((file: FileObject) => okAsync(null)),
        load: jest.fn(),
      }

      const acceptModificationRequest = makeAcceptModificationRequest({
        modificationRequestRepo,
        projectRepo,
        fileRepo: fileRepo as Repository<FileObject>,
      })
      beforeAll(async () => {
        const res = await acceptModificationRequest({
          modificationRequestId: fakeModificationRequest.id,
          versionDate: fakeModificationRequest.lastUpdatedOn,
          responseFile: { contents: fakeFileContents, filename: fakeFileName },
          acceptanceParams: { type: 'actionnaire', newActionnaire: 'new actionnaire' },
          submittedBy: fakeUser,
        })

        if (res.isErr()) logger.error(res.error)
        expect(res.isOk()).toEqual(true)
      })

      it('should call updateActionnaire on project', () => {
        expect(fakeProject.updateActionnaire).toHaveBeenCalledTimes(1)
        expect(fakeProject.updateActionnaire).toHaveBeenCalledWith(fakeUser, 'new actionnaire')
      })

      it('should save the project', () => {
        expect(projectRepo.save).toHaveBeenCalled()
        expect(projectRepo.save.mock.calls[0][0]).toEqual(fakeProject)
      })
    })

    describe('when type is puissance', () => {
      const fakeModificationRequest = {
        ...makeFakeModificationRequest(),
        type: 'puissance',
      }
      const fakeProject = {
        ...makeFakeProject(),
        id: fakeModificationRequest.projectId,
        puissanceInitiale: 10,
        puissance: 10,
      }
      const modificationRequestRepo = fakeRepo(fakeModificationRequest as ModificationRequest)
      const projectRepo = fakeRepo(fakeProject as Project)
      const fileRepo = {
        save: jest.fn((file: FileObject) => okAsync(null)),
        load: jest.fn(),
      }

      const acceptModificationRequest = makeAcceptModificationRequest({
        modificationRequestRepo,
        projectRepo,
        fileRepo: fileRepo as Repository<FileObject>,
      })

      describe('when no response file is provided', () => {
        beforeAll(async () => {
          fakeProject.updatePuissance.mockClear()
          projectRepo.save.mockClear()
          fileRepo.save.mockClear()

          const res = await acceptModificationRequest({
            modificationRequestId: fakeModificationRequest.id,
            versionDate: fakeModificationRequest.lastUpdatedOn,
            acceptanceParams: { type: 'puissance', newPuissance: 11 },
            submittedBy: fakeUser,
          })

          if (res.isErr()) logger.error(res.error)
          expect(res.isOk()).toEqual(true)
        })

        it('should call updatePuissance on project', () => {
          expect(fakeProject.updatePuissance).toHaveBeenCalledTimes(1)
          expect(fakeProject.updatePuissance).toHaveBeenCalledWith(fakeUser, 11)
        })
      })

      describe('when the acceptation follows a decision de justice', () => {
        describe('when the puissance increase is > 10% of the puissance initiale', () => {
          it('should return a PuissanceVariationWithDecisionJusticeError', async () => {
            fakeProject.updatePuissance.mockClear()
            projectRepo.save.mockClear()
            fileRepo.save.mockClear()

            const res = await acceptModificationRequest({
              modificationRequestId: fakeModificationRequest.id,
              versionDate: fakeModificationRequest.lastUpdatedOn,
              acceptanceParams: { type: 'puissance', newPuissance: 1000, isDecisionJustice: true },
              submittedBy: fakeUser,
            })

            expect(res.isErr()).toEqual(true)
            if (res.isOk()) return
            expect(res.error).toBeInstanceOf(PuissanceVariationWithDecisionJusticeError)
          })
        })

        describe('when the puissance increase is <= 10% of the puissance initiale', () => {
          it('should return an ok status', async () => {
            fakeProject.updatePuissance.mockClear()
            projectRepo.save.mockClear()
            fileRepo.save.mockClear()

            const res = await acceptModificationRequest({
              modificationRequestId: fakeModificationRequest.id,
              versionDate: fakeModificationRequest.lastUpdatedOn,
              acceptanceParams: { type: 'puissance', newPuissance: 11, isDecisionJustice: true },
              submittedBy: fakeUser,
            })

            expect(res.isOk()).toEqual(true)
          })

          it('should save the project', () => {
            expect(projectRepo.save).toHaveBeenCalled()
            expect(projectRepo.save.mock.calls[0][0]).toEqual(fakeProject)
          })
        })
      })

      describe('when a response file is provided', () => {
        beforeAll(async () => {
          fakeProject.updatePuissance.mockClear()
          projectRepo.save.mockClear()
          fileRepo.save.mockClear()

          const res = await acceptModificationRequest({
            modificationRequestId: fakeModificationRequest.id,
            versionDate: fakeModificationRequest.lastUpdatedOn,
            acceptanceParams: { type: 'puissance', newPuissance: 11 },
            responseFile: { contents: fakeFileContents, filename: fakeFileName },
            submittedBy: fakeUser,
          })

          if (res.isErr()) logger.error(res.error)
          expect(res.isOk()).toEqual(true)
        })

        it('should call updatePuissance on project', () => {
          expect(fakeProject.updatePuissance).toHaveBeenCalledTimes(1)
          expect(fakeProject.updatePuissance).toHaveBeenCalledWith(fakeUser, 11)
        })

        it('should save the project', () => {
          expect(projectRepo.save).toHaveBeenCalled()
          expect(projectRepo.save.mock.calls[0][0]).toEqual(fakeProject)
        })

        it('should save the file', () => {
          expect(fileRepo.save).toHaveBeenCalledTimes(1)
        })
      })
    })
    describe('when type is producteur', () => {
      const fakeModificationRequest = { ...makeFakeModificationRequest(), type: 'producteur' }
      const fakeProject = {
        ...makeFakeProject(),
        id: fakeModificationRequest.projectId,
      }
      const modificationRequestRepo = fakeRepo(fakeModificationRequest as ModificationRequest)
      const projectRepo = fakeRepo(fakeProject as Project)
      const fileRepo = {
        save: jest.fn((file: FileObject) => okAsync(null)),
        load: jest.fn(),
      }

      const acceptModificationRequest = makeAcceptModificationRequest({
        modificationRequestRepo,
        projectRepo,
        fileRepo: fileRepo as Repository<FileObject>,
      })
      beforeAll(async () => {
        const res = await acceptModificationRequest({
          modificationRequestId: fakeModificationRequest.id,
          versionDate: fakeModificationRequest.lastUpdatedOn,
          responseFile: { contents: fakeFileContents, filename: fakeFileName },
          acceptanceParams: { type: 'producteur', newProducteur: 'new producteur' },
          submittedBy: fakeUser,
        })

        if (res.isErr()) logger.error(res.error)
        expect(res.isOk()).toEqual(true)
      })
      it('should call updateProducteur on project', () => {
        expect(fakeProject.updateProducteur).toHaveBeenCalledTimes(1)
        expect(fakeProject.updateProducteur).toHaveBeenCalledWith(fakeUser, 'new producteur')
      })
      it('should save the project', () => {
        expect(projectRepo.save).toHaveBeenCalled()
        expect(projectRepo.save.mock.calls[0][0]).toEqual(fakeProject)
      })
    })
  })

  describe('when user is not admin', () => {
    const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

    const fakeModificationRequest = {
      ...makeFakeModificationRequest(),
    }
    const fakeProject = {
      ...makeFakeProject(),
      id: fakeModificationRequest.projectId,
    }
    const modificationRequestRepo = fakeRepo(fakeModificationRequest as ModificationRequest)
    const projectRepo = fakeRepo(fakeProject as Project)
    const fileRepo = {
      save: jest.fn((file: FileObject) => okAsync(null)),
      load: jest.fn(),
    }

    const acceptModificationRequest = makeAcceptModificationRequest({
      modificationRequestRepo,
      projectRepo,
      fileRepo: fileRepo as Repository<FileObject>,
    })

    it('should return UnauthorizedError', async () => {
      const res = await acceptModificationRequest({
        modificationRequestId: fakeModificationRequest.id,
        versionDate: fakeModificationRequest.lastUpdatedOn,
        acceptanceParams: { type: 'recours', newNotificationDate: new Date(1) },
        responseFile: { contents: fakeFileContents, filename: fakeFileName },
        submittedBy: fakeUser,
      })

      expect(res.isErr()).toEqual(true)
      if (res.isOk()) return

      expect(res.error).toBeInstanceOf(UnauthorizedError)
    })
  })

  describe('when versionDate is different than current versionDate', () => {
    const fakeModificationRequest = {
      ...makeFakeModificationRequest(),
    }
    const fakeProject = {
      ...makeFakeProject(),
      id: fakeModificationRequest.projectId,
    }
    const modificationRequestRepo = fakeRepo(fakeModificationRequest as ModificationRequest)
    const projectRepo = fakeRepo(fakeProject as Project)
    const fileRepo = {
      save: jest.fn((file: FileObject) => okAsync(null)),
      load: jest.fn(),
    }

    const acceptModificationRequest = makeAcceptModificationRequest({
      modificationRequestRepo,
      projectRepo,
      fileRepo: fileRepo as Repository<FileObject>,
    })

    it('should return AggregateHasBeenUpdatedSinceError', async () => {
      const res = await acceptModificationRequest({
        modificationRequestId: fakeModificationRequest.id,
        versionDate: new Date(1),
        acceptanceParams: { type: 'recours', newNotificationDate: new Date(1) },
        responseFile: { contents: fakeFileContents, filename: fakeFileName },
        submittedBy: fakeUser,
      })

      expect(res.isErr()).toEqual(true)
      if (res.isOk()) return
      expect(res.error).toBeInstanceOf(AggregateHasBeenUpdatedSinceError)
    })
  })
})
