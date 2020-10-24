import { makeCorrectProjectData } from './correctProjectData'
import waitForExpect from 'wait-for-expect'
import { FileService, FileContainer, File } from '../file/'
import { okAsync } from '../../core/utils'
import { UnwrapForTest } from '../../types'
import { makeProject, Project, makeUser } from '../../entities'
import makeFakeProject from '../../__tests__/fixtures/project'
import makeFakeUser from '../../__tests__/fixtures/user'
import { InMemoryEventStore } from '../../infra/inMemory'
import { Readable } from 'stream'
import { ProjectDataCorrected, ProjectNotificationDateSet } from './events'
import { ProjectHasBeenUpdatedSinceError, ProjectCannotBeUpdatedIfUnnotifiedError } from './errors'
import { UnauthorizedError } from '../shared'

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

describe('correctProjectData', () => {
  describe('when user is admin', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))

    describe('when project has not been updated since', () => {
      describe('when a certificateFile is provided', () => {
        const eventStore = new InMemoryEventStore()
        const correctProjectData = makeCorrectProjectData({
          fileService,
          findProjectById,
          eventStore,
        })

        const fakeFile = {
          path: 'test-path',
          stream: Readable.from('test-content'),
        }

        const eventHandler = jest.fn((event: ProjectDataCorrected) => null)

        beforeAll(async () => {
          mockFileServiceSave.mockClear()
          eventStore.subscribe(ProjectDataCorrected.type, eventHandler)

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

          expect(res.isOk()).toEqual(true)
        })

        it('should save the file', () => {
          expect(mockFileServiceSave).toHaveBeenCalled()
          expect(mockFileServiceSave.mock.calls[0][1].stream).toEqual(fakeFile.stream)
        })

        it('should emit ProjectDataCorrected with certificateFileId', async () => {
          await waitForExpect(() => {
            expect(eventHandler).toHaveBeenCalled()
            const projectDataCorrectedEvent = eventHandler.mock.calls[0][0]
            expect(projectDataCorrectedEvent.aggregateId).toEqual(project.id)

            const fileId = mockFileServiceSave.mock.calls[0][0].id.toString()
            expect(projectDataCorrectedEvent.payload.certificateFileId).toEqual(fileId)

            expect(projectDataCorrectedEvent.payload.correctedData).toEqual({
              isClasse: true,
            })
          })
        })
      })

      describe('when a new notification date is provided', () => {
        const eventStore = new InMemoryEventStore()
        const correctProjectData = makeCorrectProjectData({
          fileService,
          findProjectById,
          eventStore,
        })

        const eventHandler = jest.fn((event: ProjectDataCorrected) => null)
        const eventHandler2 = jest.fn((event: ProjectNotificationDateSet) => null)

        beforeAll(async () => {
          mockFileServiceSave.mockClear()
          eventStore.subscribe(ProjectDataCorrected.type, eventHandler)
          eventStore.subscribe(ProjectNotificationDateSet.type, eventHandler2)

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
          await waitForExpect(() => {
            expect(eventHandler).toHaveBeenCalled()
            const projectDataCorrectedEvent = eventHandler.mock.calls[0][0]
            expect(projectDataCorrectedEvent.aggregateId).toEqual(project.id)

            expect(projectDataCorrectedEvent.payload.certificateFileId).toBeUndefined()

            expect(projectDataCorrectedEvent.payload.correctedData).toEqual({
              isClasse: true,
            })
          })
        })

        it('should emit ProjectNotificationDateSet', async () => {
          await waitForExpect(() => {
            expect(eventHandler2).toHaveBeenCalled()
            const projectNotificationDateSetEvent = eventHandler2.mock.calls[0][0]
            expect(projectNotificationDateSetEvent.aggregateId).toEqual(project.id)

            expect(projectNotificationDateSetEvent.payload.projectId).toEqual(project.id)

            expect(projectNotificationDateSetEvent.payload.notifiedOn).toEqual(2)
          })
        })
      })

      describe('when no certificateFile is provided', () => {
        const eventStore = new InMemoryEventStore()
        const correctProjectData = makeCorrectProjectData({
          fileService,
          findProjectById,
          eventStore,
        })

        const eventHandler = jest.fn((event: ProjectDataCorrected) => null)

        beforeAll(async () => {
          mockFileServiceSave.mockClear()
          eventStore.subscribe(ProjectDataCorrected.type, eventHandler)

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
          await waitForExpect(() => {
            expect(eventHandler).toHaveBeenCalled()
            const projectDataCorrectedEvent = eventHandler.mock.calls[0][0]
            expect(projectDataCorrectedEvent.aggregateId).toEqual(project.id)

            expect(projectDataCorrectedEvent.payload.certificateFileId).toBeUndefined()

            expect(projectDataCorrectedEvent.payload.correctedData).toEqual({
              isClasse: true,
            })
          })
        })
      })
    })

    describe('when project has been updated since', () => {
      const eventStore = new InMemoryEventStore()
      const correctProjectData = makeCorrectProjectData({
        fileService,
        findProjectById,
        eventStore,
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
      const eventStore = new InMemoryEventStore()
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
        eventStore,
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
    const eventStore = new InMemoryEventStore()
    const correctProjectData = makeCorrectProjectData({
      fileService,
      findProjectById,
      eventStore,
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
