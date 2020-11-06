import { FileService } from './FileService'
import { File } from './File'
import { FileStorageService } from './FileStorageService'
import { Repository } from '../../core/domain'
import { Readable } from 'stream'
import { okAsync } from '../../core/utils'
import { BaseShouldUserAccessProject } from '../authorization/ShouldUserAccessProject'
import { makeUser } from '../../entities'
import { UnwrapForTest } from '../../types'
import makeFakeUser from '../../__tests__/fixtures/user'

const mockShouldUserAccessProjectCheck = jest.fn(async (args) => true)
jest.mock('../authorization/ShouldUserAccessProject', () => ({
  BaseShouldUserAccessProject: function () {
    return {
      check: mockShouldUserAccessProjectCheck,
    }
  },
}))

const MockShouldUserAccessProject = <jest.Mock<BaseShouldUserAccessProject>>(
  BaseShouldUserAccessProject
)

describe('FileService', () => {
  describe('FileService.save()', () => {
    const fakeStorageService: FileStorageService = {
      save: jest.fn(() => okAsync('fakeId')),
      load: jest.fn(),
      remove: jest.fn(),
    }

    const fakeFileRepo: Repository<File> = {
      save: jest.fn(() => okAsync(null)),
      load: jest.fn(),
    }

    const fakeFileResult = File.create({
      designation: 'other',
      filename: 'testfile',
      forProject: '',
      createdBy: '',
    })
    let fakeFile: File
    const fakeFileContents = {
      path: 'test-path',
      stream: Readable.from('test-content'),
    }

    const shouldUserAccessProject = new MockShouldUserAccessProject()

    const fileService = new FileService(fakeStorageService, fakeFileRepo, shouldUserAccessProject)

    beforeAll(async () => {
      expect(fakeFileResult.isOk()).toBe(true)
      if (fakeFileResult.isErr()) return

      fakeFile = fakeFileResult.value

      const saveResult = await fileService.save(fakeFile, fakeFileContents)
      expect(saveResult.isOk()).toBe(true)
    })

    it('should save the file contents to storage', async () => {
      expect(fakeStorageService.save).toHaveBeenCalledWith(fakeFileContents)
    })

    it('should save the File entity with the storage identifier', async () => {
      expect(fakeFileRepo.save).toHaveBeenCalledWith(fakeFile)
      expect(fakeFile.storedAt).toBeDefined()
    })
  })

  describe('FileService.load()', () => {
    const fakeFileContents = {
      path: 'test-path',
      stream: Readable.from('test-content'),
    }

    const fakeFileStorageId = 'fakeFileStorageId'
    const fakeProjectId = 'fakeProjectId'

    const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

    const shouldUserAccessProject = new MockShouldUserAccessProject()

    let fakeFile: File
    const fakeStorageService: FileStorageService = {
      save: jest.fn(),
      load: jest.fn((fileId: string) => okAsync(fakeFileContents)),
      remove: jest.fn(),
    }

    beforeAll(async () => {
      mockShouldUserAccessProjectCheck.mockClear()

      const fakeFileResult = File.create({
        filename: 'filename',
        forProject: fakeProjectId,
        createdBy: '',
        designation: 'other',
        storedAt: fakeFileStorageId,
      })

      expect(fakeFileResult.isOk()).toBe(true)
      if (fakeFileResult.isErr()) return

      fakeFile = fakeFileResult.value

      const fakeFileRepo: Repository<File> = {
        save: jest.fn(),
        load: jest.fn(() => okAsync(fakeFile)),
      }
      const fileService = new FileService(fakeStorageService, fakeFileRepo, shouldUserAccessProject)

      const loadResult = await fileService.load(fakeFileStorageId, fakeUser)

      expect(loadResult.isOk()).toBe(true)
    })

    it('should check if the user is authorized', async () => {
      expect(mockShouldUserAccessProjectCheck).toHaveBeenCalledWith({
        projectId: fakeProjectId,
        user: fakeUser,
      })
    })

    it('should retrieve the file from the storage service', async () => {
      expect(fakeStorageService.load).toHaveBeenCalledWith(fakeFileStorageId)
    })
  })
})
