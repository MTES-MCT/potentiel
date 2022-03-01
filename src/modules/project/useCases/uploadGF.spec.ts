import { Readable } from 'stream'
import { DomainEvent, Repository, UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { makeUser } from '@entities'
import { FileObject } from '@modules/file'
import { InfraNotAvailableError } from '@modules/shared'
import { UnwrapForTest } from '../../../types'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { UnauthorizedError } from '../../shared'
import { makeUploadGF } from './uploadGF'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { Project } from '../Project'

const projectId = new UniqueEntityID().toString()

const fakeFileContents = {
  filename: 'fakeFile.pdf',
  contents: Readable.from('test-content'),
}

const fakePublish = jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null))

const fakeProject = makeFakeProject()

const projectRepo = fakeTransactionalRepo(fakeProject as Project)

describe('uploadGF use-case', () => {
  describe('when the user has rights on this project', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

    const fileRepo = {
      save: jest.fn((file: FileObject) => okAsync(null)),
      load: jest.fn(),
    }

    const gfDate = new Date(123)

    beforeAll(async () => {
      const shouldUserAccessProject = jest.fn(async () => true)

      fakePublish.mockClear()

      const uploadGF = makeUploadGF({
        fileRepo: fileRepo as Repository<FileObject>,
        shouldUserAccessProject,
        projectRepo,
      })

      const res = await uploadGF({
        file: fakeFileContents,
        stepDate: gfDate,
        projectId,
        submittedBy: user,
      })

      expect(res.isOk()).toBe(true)

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId,
      })
    })

    it('should save the attachment file', async () => {
      expect(fileRepo.save).toHaveBeenCalled()
      expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents.contents)
    })

    it('should add the GF', () => {
      const fakeFile = fileRepo.save.mock.calls[0][0]
      expect(fakeProject.addGarantiesFinancieres).toHaveBeenCalledWith(
        gfDate,
        fakeFile.id.toString(),
        user
      )
    })
  })

  describe('When the user doesnt have rights on the project', () => {
    it('should return an UnauthorizedError', async () => {
      fakePublish.mockClear()

      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

      const shouldUserAccessProject = jest.fn(async () => false)

      const fileRepo = {
        save: jest.fn(),
        load: jest.fn(),
      }

      const submitStep = makeUploadGF({
        fileRepo,
        shouldUserAccessProject,
        projectRepo,
      })

      const res = await submitStep({
        file: fakeFileContents,
        stepDate: new Date(123),
        projectId,
        submittedBy: user,
      })

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)

      expect(fakePublish).not.toHaveBeenCalled()
    })
  })
})
