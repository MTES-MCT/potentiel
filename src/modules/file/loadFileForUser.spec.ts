import makeFakeUser from '../../__tests__/fixtures/user'
import { okAsync } from '../../core/utils'
import { Repository, UniqueEntityID } from '../../core/domain'
import { makeUser, User } from '../../entities'
import { FileAccessDeniedError } from './errors'
import { FileObject } from './FileObject'
import { makeLoadFileForUser } from './loadFileForUser'
import { GetFileProject } from './queries'
import { UnwrapForTest } from '../../types'

describe('loadFileForUser', () => {
  const fakeUser = {} as User
  const fakeFile = {} as FileObject
  const fileId = new UniqueEntityID()

  describe('when the file does not have a project', () => {
    const getFileProject = jest.fn((fileId) => okAsync(null)) as GetFileProject

    describe('when the user is not admin', () => {
      const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

      const shouldUserAccessProject = {
        check: jest.fn(),
      }

      const fileRepo = {
        save: jest.fn(),
        load: jest.fn((fileId: UniqueEntityID) => okAsync(fakeFile)),
      }

      const loadFileForUser = makeLoadFileForUser({
        fileRepo: fileRepo as Repository<FileObject>,
        getFileProject,
        shouldUserAccessProject,
      })

      it('should return FileAccessDeniedError', async () => {
        const res = await loadFileForUser({ user: fakeUser, fileId })

        expect(res.isErr()).toBe(true)
        if (res.isOk()) return

        expect(res.error).toBeInstanceOf(FileAccessDeniedError)
      })
    })

    describe('when the user is admin', () => {
      const fakeUser = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))

      const shouldUserAccessProject = {
        check: jest.fn(),
      }

      const fileRepo = {
        save: jest.fn(),
        load: jest.fn((fileId: UniqueEntityID) => okAsync(fakeFile)),
      }

      const loadFileForUser = makeLoadFileForUser({
        fileRepo: fileRepo as Repository<FileObject>,
        getFileProject,
        shouldUserAccessProject,
      })

      it('should return the file', async () => {
        const res = await loadFileForUser({ user: fakeUser, fileId })

        expect(res.isOk()).toBe(true)
        if (res.isErr()) return

        expect(res.value).toEqual(fakeFile)
      })
    })
  })

  describe('when the file has a project', () => {
    const projectId = new UniqueEntityID()

    const getFileProject = jest.fn((fileId) => okAsync(projectId)) as GetFileProject

    describe('when the user has rights on the project', () => {
      const shouldUserAccessProject = {
        check: jest.fn(async () => true),
      }

      const fileRepo = {
        save: jest.fn(),
        load: jest.fn((fileId: UniqueEntityID) => okAsync(fakeFile)),
      }

      const loadFileForUser = makeLoadFileForUser({
        fileRepo: fileRepo as Repository<FileObject>,
        getFileProject,
        shouldUserAccessProject,
      })

      it('should return the file', async () => {
        const res = await loadFileForUser({ user: fakeUser, fileId })

        expect(res.isOk()).toBe(true)
        if (res.isErr()) return

        expect(shouldUserAccessProject.check).toHaveBeenCalledWith({
          projectId: projectId.toString(),
          user: fakeUser,
        })
        expect(fileRepo.load).toHaveBeenCalledWith(fileId)
        expect(res.value).toEqual(fakeFile)
      })
    })

    describe('when the user does not have rights on the project', () => {
      const shouldUserAccessProject = {
        check: jest.fn(async () => false),
      }

      const fileRepo = {
        save: jest.fn(),
        load: jest.fn((fileId: UniqueEntityID) => okAsync(fakeFile)),
      }

      const loadFileForUser = makeLoadFileForUser({
        fileRepo: fileRepo as Repository<FileObject>,
        getFileProject,
        shouldUserAccessProject,
      })

      it('should return FileAccessDeniedError', async () => {
        const res = await loadFileForUser({ user: fakeUser, fileId })

        expect(res.isErr()).toBe(true)
        if (res.isOk()) return

        expect(res.error).toBeInstanceOf(FileAccessDeniedError)
      })
    })
  })
})
