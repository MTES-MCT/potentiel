import makeRequestModification, { ACCESS_DENIED_ERROR } from './requestModification'

import makeFakeUser from '../__tests__/fixtures/user'
import { Readable } from 'stream'
import { modificationRequestRepo } from '../dataAccess/inMemory'
import { FileService } from '../modules/file/FileService'
import { FileContainer, File } from '../modules/file'
import { okAsync } from '../core/utils'

const mockFileServiceSave = jest.fn(async (file: File, fileContent: FileContainer) => okAsync(null))
jest.mock('../modules/file/FileService', () => ({
  FileService: function () {
    return {
      save: mockFileServiceSave,
    }
  },
}))

const MockFileService = <jest.Mock<FileService>>FileService

const fileService = new MockFileService()

const fakeFileContents = {
  path: 'fakeFile.pdf',
  stream: Readable.from('test-content'),
}

describe('requestModification use-case', () => {
  describe('given user has no rights on this project', () => {
    const shouldUserAccessProject = jest.fn(async () => false)

    const requestModification = makeRequestModification({
      fileService,
      modificationRequestRepo,
      shouldUserAccessProject,
    })

    it('should return ACCESS_DENIED_ERROR', async () => {
      mockFileServiceSave.mockClear()
      const user = makeFakeUser({ role: 'porteur-projet' })
      const requestResult = await requestModification({
        type: 'actionnaire',
        actionnaire: 'nouvel actionnaire',
        file: fakeFileContents,
        user,
        projectId: 'project1',
      })

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId: 'project1',
      })

      expect(mockFileServiceSave).not.toHaveBeenCalled()
      expect(requestResult.is_err()).toEqual(true)
      expect(requestResult.unwrap_err().message).toEqual(ACCESS_DENIED_ERROR)
    })
  })

  describe('given user is not a porteur-projet', () => {
    const shouldUserAccessProject = jest.fn()

    const requestModification = makeRequestModification({
      fileService,
      modificationRequestRepo,
      shouldUserAccessProject,
    })

    it('should return ACCESS_DENIED_ERROR', async () => {
      mockFileServiceSave.mockClear()

      const user = makeFakeUser({ role: 'admin' })
      const requestResult = await requestModification({
        type: 'actionnaire',
        actionnaire: 'nouvel actionnaire',
        file: fakeFileContents,
        user,
        projectId: 'project1',
      })

      expect(shouldUserAccessProject).not.toHaveBeenCalled()
      expect(mockFileServiceSave).not.toHaveBeenCalled()
      expect(requestResult.is_err()).toEqual(true)
      expect(requestResult.unwrap_err().message).toEqual(ACCESS_DENIED_ERROR)
    })
  })

  describe('given user is the projects porteur-project', () => {
    const shouldUserAccessProject = jest.fn(async () => true)

    const requestModification = makeRequestModification({
      fileService,
      modificationRequestRepo,
      shouldUserAccessProject,
    })

    it('should register the modification request', async () => {
      const user = makeFakeUser({ id: '1234', role: 'porteur-projet' })
      const requestResult = await requestModification({
        type: 'actionnaire' as 'actionnaire',
        actionnaire: 'nouvel actionnaire',
        file: fakeFileContents,
        user,
        projectId: 'project1',
      })

      expect(requestResult.is_ok()).toEqual(true)

      const allRequests = await modificationRequestRepo.findAll()

      expect(allRequests).toHaveLength(1)

      // Make sure the file has been saved
      expect(mockFileServiceSave).toHaveBeenCalled()
      expect(mockFileServiceSave.mock.calls[0][1].stream).toEqual(fakeFileContents.stream)
      const fakeFile = mockFileServiceSave.mock.calls[0][0]
      expect(fakeFile).toBeDefined()

      const newRequest = allRequests[0]
      expect(newRequest).toEqual(
        expect.objectContaining({
          type: 'actionnaire' as 'actionnaire',
          actionnaire: 'nouvel actionnaire',
          fileId: fakeFile.id.toString(),
          userId: user.id,
          projectId: 'project1',
        })
      )
    })
  })
})
