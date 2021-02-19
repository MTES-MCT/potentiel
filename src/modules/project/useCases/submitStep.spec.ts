import { Readable } from 'stream'
import { Repository, UniqueEntityID } from '../../../core/domain'
import { okAsync } from '../../../core/utils'
import { makeUser } from '../../../entities'
import { EventBus, StoredEvent } from '../../../modules/eventStore'
import { FileObject } from '../../../modules/file'
import { InfraNotAvailableError } from '../../../modules/shared'
import { UnwrapForTest } from '../../../types'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { UnauthorizedError } from '../../shared'
import { ProjectPTFSubmitted } from '../events'
import { makeSubmitStep } from './submitStep'

const projectId = new UniqueEntityID().toString()

const fakeFileContents = {
  filename: 'fakeFile.pdf',
  contents: Readable.from('test-content'),
}

const fakePublish = jest.fn((event: StoredEvent) => okAsync<null, InfraNotAvailableError>(null))

const fakeEventBus: EventBus = {
  publish: fakePublish,
  subscribe: jest.fn(),
}

describe('submitStep use-case', () => {
  describe('when the user has rights on this project', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

    const fileRepo = {
      save: jest.fn((file: FileObject) => okAsync(null)),
      load: jest.fn(),
    }

    describe('when type is ptf', () => {
      const ptfDate = new Date(123)

      beforeAll(async () => {
        const shouldUserAccessProject = jest.fn(async () => true)
        fakePublish.mockClear()

        const submitStep = makeSubmitStep({
          eventBus: fakeEventBus,
          fileRepo: fileRepo as Repository<FileObject>,
          shouldUserAccessProject,
        })

        const res = await submitStep({
          type: 'ptf',
          file: fakeFileContents,
          stepDate: ptfDate,
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

      it('should trigger a ProjectPTFSubmitted event', async () => {
        expect(fakePublish).toHaveBeenCalled()
        const targetEvent = fakePublish.mock.calls
          .map((call) => call[0])
          .find((event) => event.type === ProjectPTFSubmitted.type) as ProjectPTFSubmitted

        expect(targetEvent).toBeDefined()
        if (!targetEvent) return

        expect(targetEvent.payload.projectId).toEqual(projectId)

        const fakeFile = fileRepo.save.mock.calls[0][0]

        expect(targetEvent.payload.ptfDate).toEqual(ptfDate)
        expect(targetEvent.payload.fileId).toEqual(fakeFile.id.toString())
        expect(targetEvent.payload.submittedBy).toEqual(user.id)
      })
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

      const submitStep = makeSubmitStep({
        eventBus: fakeEventBus,
        fileRepo,
        shouldUserAccessProject,
      })

      const res = await submitStep({
        type: 'ptf',
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
