import { Readable } from 'stream'
import { DomainError, Repository, UniqueEntityID } from '../../../core/domain'
import { okAsync } from '../../../core/utils'
import { makeUser } from '../../../entities'
import { UnwrapForTest } from '../../../types'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { FileObject } from '../../file'
import { UnauthorizedError } from '../../shared'
import { ProjectHasBeenUpdatedSinceError } from '../errors'
import { Project } from '../Project'
import { makeCorrectProjectData } from './correctProjectData'

const projectId = 'project1'

const fakeGenerateCertificate = jest.fn((projectId: string) => okAsync<null, DomainError>(null))

describe('correctProjectData', () => {
  describe('when user is not admin', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

    const fakeProject = { ...makeFakeProject(), id: new UniqueEntityID(projectId) }

    const projectRepo = fakeTransactionalRepo(fakeProject as Project)

    const fileRepo: Repository<FileObject> = {
      save: jest.fn(),
      load: jest.fn(),
    }

    const correctProjectData = makeCorrectProjectData({
      generateCertificate: fakeGenerateCertificate,
      projectRepo,
      fileRepo,
    })

    it('should return an UnauthorizedError', async () => {
      const res = await correctProjectData({
        projectId,
        projectVersionDate: new Date(),
        newNotifiedOn: 123,
        user,
        shouldGrantClasse: false,
        correctedData: {
          numeroCRE: '1',
        },
      })

      expect(res.isErr()).toEqual(true)
      if (res.isOk()) return
      expect(res.error).toBeInstanceOf(UnauthorizedError)
    })
  })

  describe('when user is admin', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))

    describe('when project has been updated since', () => {
      const fakeProject = {
        ...makeFakeProject(),
        id: new UniqueEntityID(projectId),
        lastUpdatedOn: new Date(1),
      }
      const projectRepo = fakeTransactionalRepo(fakeProject as Project)
      const fileRepo: Repository<FileObject> = {
        save: jest.fn(),
        load: jest.fn(),
      }

      const correctProjectData = makeCorrectProjectData({
        generateCertificate: fakeGenerateCertificate,
        projectRepo,
        fileRepo,
      })

      it('should return a ProjectHasBeenUpdatedSinceError', async () => {
        const res = await correctProjectData({
          projectId: projectId,
          projectVersionDate: new Date(0), // before new Date(1)
          newNotifiedOn: 1,
          user,
          shouldGrantClasse: true,
          correctedData: {},
        })

        expect(res.isErr()).toEqual(true)
        if (res.isOk()) return
        expect(res.error).toBeInstanceOf(ProjectHasBeenUpdatedSinceError)
      })
    })

    describe('when project has not been updated since', () => {
      describe('when a certificate is provided', () => {
        const fakeProject = {
          ...makeFakeProject(),
          id: new UniqueEntityID(projectId),
          lastUpdatedOn: new Date(0),
          shouldCertificateBeGenerated: false,
        }
        const projectRepo = fakeTransactionalRepo(fakeProject as Project)
        const fileRepo = {
          save: jest.fn((file: FileObject) => okAsync(null)),
          load: jest.fn(),
        }

        const correctProjectData = makeCorrectProjectData({
          generateCertificate: fakeGenerateCertificate,
          projectRepo,
          fileRepo: fileRepo as Repository<FileObject>,
        })

        const fakeFileContents = Readable.from('test-content')
        const fakeFilename = 'filename'

        beforeAll(async () => {
          fakeProject.uploadCertificate.mockClear()
          fakeGenerateCertificate.mockClear()

          const res = await correctProjectData({
            projectId: projectId,
            projectVersionDate: new Date(0),
            certificateFile: {
              contents: fakeFileContents,
              filename: fakeFilename,
            },
            newNotifiedOn: 1234,
            user,
            shouldGrantClasse: true,
            correctedData: {
              numeroCRE: 'nouveauNumero',
            },
          })

          if (res.isErr()) console.log('error', res.error)
          expect(res.isOk()).toEqual(true)
        })

        it('should save the file', () => {
          expect(fileRepo.save).toHaveBeenCalled()
          expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents)
          expect(fileRepo.save.mock.calls[0][0].filename).toEqual(fakeFilename)
        })

        it('should call project.uploadCertificate()', () => {
          expect(fakeProject.uploadCertificate).toHaveBeenCalledTimes(1)
          expect(fakeProject.uploadCertificate.mock.calls[0][0]).toEqual(user)
        })

        it('should call project.correctData()', async () => {
          expect(fakeProject.correctData).toHaveBeenCalledTimes(1)
          expect(fakeProject.correctData).toHaveBeenCalledWith(user, {
            numeroCRE: 'nouveauNumero',
          })
        })

        it('should call project.grantClasse()', async () => {
          expect(fakeProject.grantClasse).toHaveBeenCalledTimes(1)
          expect(fakeProject.grantClasse).toHaveBeenCalledWith(user)
        })

        it('should call project.setNotificationDate()', async () => {
          expect(fakeProject.setNotificationDate).toHaveBeenCalledTimes(1)
          expect(fakeProject.setNotificationDate).toHaveBeenCalledWith(user, 1234)
        })

        it('should not call generateCertificate', () => {
          expect(fakeGenerateCertificate).not.toHaveBeenCalled()
        })
      })

      describe('when no certificate is provided', () => {
        const fakeProject = {
          ...makeFakeProject(),
          id: new UniqueEntityID(projectId),
          lastUpdatedOn: new Date(0),
        }
        const projectRepo = fakeTransactionalRepo(fakeProject as Project)
        const fileRepo: Repository<FileObject> = {
          save: jest.fn(),
          load: jest.fn(),
        }

        const correctProjectData = makeCorrectProjectData({
          generateCertificate: fakeGenerateCertificate,
          projectRepo,
          fileRepo,
        })

        beforeAll(async () => {
          fakeProject.uploadCertificate.mockClear()
          fakeGenerateCertificate.mockClear()

          const res = await correctProjectData({
            projectId: projectId,
            projectVersionDate: new Date(0),
            newNotifiedOn: 1234,
            user,
            shouldGrantClasse: true,
            correctedData: {
              numeroCRE: 'nouveauNumero',
            },
          })

          if (res.isErr()) console.log('error', res.error)
          expect(res.isOk()).toEqual(true)
        })

        it('should call generateCertificate', () => {
          expect(fakeGenerateCertificate).toHaveBeenCalled()
        })
      })
    })
  })
})
