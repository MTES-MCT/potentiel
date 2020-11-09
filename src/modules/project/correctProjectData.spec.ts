import { Readable } from 'stream'
import { okAsync } from '../../core/utils'
import { makeProject, makeUser, Project } from '../../entities'
import { UnwrapForTest } from '../../types'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'
import { EventBus, StoredEvent } from '../eventStore'
import { File, FileContainer, FileService } from '../file/'
import { InfraNotAvailableError, UnauthorizedError } from '../shared'
import { makeCorrectProjectData } from './correctProjectData'
import { ProjectCannotBeUpdatedIfUnnotifiedError, ProjectHasBeenUpdatedSinceError } from './errors'
import { ProjectDataCorrected, ProjectNotificationDateSet } from './events'

const mockFileServiceSave = jest.fn((file: File, fileContents: FileContainer) => okAsync(null))
jest.mock('../file/FileService', () => ({
  FileService: function () {
    return {
      save: mockFileServiceSave,
    }
  },
}))
const MockFileService = <jest.Mock<FileService>>FileService

const fileService = new MockFileService()

const project = UnwrapForTest(
  makeProject(
    makeFakeProject({
      classe: 'Classé',
      notifiedOn: 1,
      appelOffreId: 'Fessenheim',
      periodeId: '2',
      updatedAt: new Date(),
    })
  )
)
const projectVersionDate = project.updatedAt
const findProjectById = jest.fn(async (projectId: Project['id']) => project)

const fakePublish = jest.fn((event: StoredEvent) => okAsync<null, InfraNotAvailableError>(null))
const eventBus: EventBus = {
  publish: fakePublish,
  subscribe: jest.fn(),
}

describe('correctProjectData', () => {
  describe('when user is admin', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))

    describe('when project has not been updated since', () => {
      describe('when a certificateFile is provided', () => {
        const correctProjectData = makeCorrectProjectData({
          fileService,
          findProjectById,
          eventBus,
        })

        const fakeFile = {
          path: 'test-path',
          stream: Readable.from('test-content'),
        }

        beforeAll(async () => {
          mockFileServiceSave.mockClear()
          fakePublish.mockClear()

          const res = await correctProjectData({
            projectId: project.id,
            certificateFile: fakeFile,
            projectVersionDate,
            newNotifiedOn: 1,
            user,
            correctedData: {
              isClasse: true,
            },
          })

          if (res.isErr()) console.log('error', res.error)
          expect(res.isOk()).toEqual(true)
        })

        it('should save the file', () => {
          expect(mockFileServiceSave).toHaveBeenCalled()
          expect(mockFileServiceSave.mock.calls[0][1].stream).toEqual(fakeFile.stream)
        })

        it('should emit ProjectDataCorrected with certificateFileId', async () => {
          expect(fakePublish).toHaveBeenCalled()
          const targetEvent = fakePublish.mock.calls
            .map((call) => call[0])
            .find((event) => event.type === ProjectDataCorrected.type) as ProjectDataCorrected

          expect(targetEvent).toBeDefined()
          if (!targetEvent) return

          expect(targetEvent.aggregateId).toEqual(project.id)

          const fileId = mockFileServiceSave.mock.calls[0][0].id.toString()
          expect(targetEvent.payload.certificateFileId).toEqual(fileId)

          expect(targetEvent.payload.correctedData).toEqual({
            isClasse: true,
          })
        })
      })

      describe('when a new notification date is provided', () => {
        const correctProjectData = makeCorrectProjectData({
          fileService,
          findProjectById,
          eventBus,
        })

        beforeAll(async () => {
          mockFileServiceSave.mockClear()
          fakePublish.mockClear()

          const res = await correctProjectData({
            projectId: project.id,
            projectVersionDate,
            newNotifiedOn: 2,
            user,
            correctedData: {
              isClasse: true,
            },
          })

          expect(res.isOk()).toEqual(true)
        })

        it('should emit ProjectDataCorrected', async () => {
          expect(fakePublish).toHaveBeenCalled()
          const targetEvent = fakePublish.mock.calls
            .map((call) => call[0])
            .find((event) => event.type === ProjectDataCorrected.type) as ProjectDataCorrected

          expect(targetEvent).toBeDefined()
          if (!targetEvent) return

          expect(targetEvent.aggregateId).toEqual(project.id)

          expect(targetEvent.payload.certificateFileId).toBeUndefined()

          expect(targetEvent.payload.correctedData).toEqual({
            isClasse: true,
          })
        })

        it('should emit ProjectNotificationDateSet', async () => {
          expect(fakePublish).toHaveBeenCalled()
          const targetEvent = fakePublish.mock.calls
            .map((call) => call[0])
            .find(
              (event) => event.type === ProjectNotificationDateSet.type
            ) as ProjectNotificationDateSet

          expect(targetEvent).toBeDefined()
          if (!targetEvent) return

          expect(targetEvent.aggregateId).toEqual(project.id)

          expect(targetEvent.payload.projectId).toEqual(project.id)

          expect(targetEvent.payload.notifiedOn).toEqual(2)
        })
      })

      describe('when no certificateFile is provided', () => {
        const correctProjectData = makeCorrectProjectData({
          fileService,
          findProjectById,
          eventBus,
        })

        beforeAll(async () => {
          mockFileServiceSave.mockClear()
          fakePublish.mockClear()

          const res = await correctProjectData({
            projectId: project.id,
            projectVersionDate,
            newNotifiedOn: project.notifiedOn,
            user,
            correctedData: {
              isClasse: true,
            },
          })

          expect(res.isOk()).toEqual(true)
        })

        it('should emit ProjectDataCorrected without certificateFileId', async () => {
          expect(fakePublish).toHaveBeenCalled()
          const targetEvent = fakePublish.mock.calls
            .map((call) => call[0])
            .find((event) => event.type === ProjectDataCorrected.type) as ProjectDataCorrected

          expect(targetEvent).toBeDefined()
          if (!targetEvent) return

          expect(targetEvent.aggregateId).toEqual(project.id)

          expect(targetEvent.payload.certificateFileId).toBeUndefined()

          expect(targetEvent.payload.correctedData).toEqual({
            isClasse: true,
          })
        })
      })
    })

    describe('when project has been updated since', () => {
      const correctProjectData = makeCorrectProjectData({
        fileService,
        findProjectById,
        eventBus,
      })

      it('should return a ProjectHasBeenUpdatedSinceError', async () => {
        const res = await correctProjectData({
          projectId: project.id,
          projectVersionDate: new Date(0),
          newNotifiedOn: project.notifiedOn,
          user,
          correctedData: {
            isClasse: true,
          },
        })

        expect(res.isErr()).toEqual(true)
        if (res.isOk()) return
        expect(res.error).toBeInstanceOf(ProjectHasBeenUpdatedSinceError)
      })
    })

    describe('when project is not notified', () => {
      const unnotifiedProject = UnwrapForTest(
        makeProject(
          makeFakeProject({
            notifiedOn: 0,
            updatedAt: new Date(),
          })
        )
      )
      const projectVersionDate = unnotifiedProject.updatedAt
      const findProjectById = jest.fn(async (projectId: Project['id']) => unnotifiedProject)

      const correctProjectData = makeCorrectProjectData({
        fileService,
        findProjectById,
        eventBus,
      })

      it('should return a ProjectCannotBeUpdatedIfUnnotifiedError', async () => {
        const res = await correctProjectData({
          projectId: project.id,
          projectVersionDate,
          newNotifiedOn: project.notifiedOn,
          user,
          correctedData: {
            isClasse: true,
          },
        })

        expect(res.isErr()).toEqual(true)
        if (res.isOk()) return
        expect(res.error).toBeInstanceOf(ProjectCannotBeUpdatedIfUnnotifiedError)
      })
    })
  })

  describe('when user is not admin', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))
    const correctProjectData = makeCorrectProjectData({
      fileService,
      findProjectById,
      eventBus,
    })

    it('should return an UnauthorizedError', async () => {
      const res = await correctProjectData({
        projectId: project.id,
        projectVersionDate,
        newNotifiedOn: project.notifiedOn,
        user,
        correctedData: {
          isClasse: true,
        },
      })

      expect(res.isErr()).toEqual(true)
      if (res.isOk()) return
      expect(res.error).toBeInstanceOf(UnauthorizedError)
    })
  })
})
