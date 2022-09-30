import { Readable } from 'stream'
import { DomainEvent, Repository } from '@core/domain'
import { okAsync } from '@core/utils'
import { FileObject } from '@modules/file'
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared'
import makeFakeUser from '../__tests__/fixtures/user'
import makeRequestModification from './requestModification'
import { fakeRepo } from '../__tests__/fixtures/aggregates'
import { Project } from '@modules/project'
import makeFakeProject from '../__tests__/fixtures/project'

const fakeFileContents = {
  filename: 'fakeFile.pdf',
  contents: Readable.from('test-content'),
}

const fakeProject = makeFakeProject()

describe('requestModification use-case', () => {
  describe('given user has no rights on this project', () => {
    const shouldUserAccessProject = jest.fn(async () => false)
    const projectRepo = fakeRepo({
      ...fakeProject,
    } as Project)

    const fileRepo = {
      save: jest.fn(),
      load: jest.fn(),
    }

    const eventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    }

    const requestModification = makeRequestModification({
      fileRepo,
      eventBus,
      shouldUserAccessProject,
      projectRepo,
    })

    it('should return ACCESS_DENIED_ERROR', async () => {
      const user = makeFakeUser({ role: 'porteur-projet' })
      const requestResult = await requestModification({
        type: 'abandon',
        justification: 'justification',
        file: fakeFileContents,
        user,
        projectId: 'project1',
      })

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId: 'project1',
      })

      expect(fileRepo.save).not.toHaveBeenCalled()
      expect(requestResult.isErr()).toEqual(true)
      expect(requestResult._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
    })
  })

  describe('given user is not a porteur-projet', () => {
    const shouldUserAccessProject = jest.fn()
    const projectRepo = fakeRepo(fakeProject as Project)

    const fileRepo = {
      save: jest.fn(),
      load: jest.fn(),
    }

    const eventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    }

    const requestModification = makeRequestModification({
      fileRepo,
      eventBus,
      shouldUserAccessProject,
      projectRepo,
    })

    it('should return ACCESS_DENIED_ERROR', async () => {
      const user = makeFakeUser({ role: 'admin' })
      const requestResult = await requestModification({
        type: 'abandon',
        justification: 'justification',
        file: fakeFileContents,
        user,
        projectId: 'project1',
      })

      expect(shouldUserAccessProject).not.toHaveBeenCalled()
      expect(fileRepo.save).not.toHaveBeenCalled()
      expect(requestResult.isErr()).toEqual(true)
      expect(requestResult._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError)
    })
  })

  describe('given user is the projects porteur-project', () => {
    const user = makeFakeUser({ id: '1234', role: 'porteur-projet' })
    const shouldUserAccessProject = jest.fn(async () => true)
    const projectRepo = fakeRepo({
      ...fakeProject,
      cahierDesCharges: { paruLe: 'initial' },
    } as Project)

    describe('given request is actionnaire', () => {
      const fileRepo = {
        save: jest.fn((file: FileObject) => okAsync(null)),
        load: jest.fn(),
      }

      const eventBus = {
        publish: jest.fn((event: DomainEvent) => okAsync<null, InfraNotAvailableError>(null)),
        subscribe: jest.fn(),
      }

      const requestModification = makeRequestModification({
        fileRepo: fileRepo as Repository<FileObject>,
        eventBus,
        shouldUserAccessProject,
        projectRepo,
      })

      beforeAll(async () => {
        const requestResult = await requestModification({
          type: 'abandon',
          justification: 'justification',
          file: fakeFileContents,
          user,
          projectId: 'project1',
        })

        expect(requestResult.isOk()).toEqual(true)
      })

      it('should save the file attachment', () => {
        // Make sure the file has been saved
        expect(fileRepo.save).toHaveBeenCalled()
        expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents.contents)
        const fakeFile = fileRepo.save.mock.calls[0][0]
        expect(fakeFile).toBeDefined()
      })

      it('should emit ModificationRequested', () => {
        const fakeFile = fileRepo.save.mock.calls[0][0]
        expect(eventBus.publish).toHaveBeenCalledTimes(1)
        expect(eventBus.publish.mock.calls[0][0].payload).toEqual(
          expect.objectContaining({
            type: 'abandon',
            justification: 'justification',
            fileId: fakeFile.id.toString(),
            requestedBy: user.id,
            projectId: 'project1',
            cahierDesCharges: 'initial',
          })
        )
      })
    })
  })
})
