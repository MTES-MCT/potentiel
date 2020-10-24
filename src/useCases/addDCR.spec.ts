import { Readable } from 'stream'
import waitForExpect from 'wait-for-expect'
import { okAsync } from '../core/utils'
import { makeProject, makeUser, Project } from '../entities'
import { File, FileContainer } from '../modules/file'
import { FileService } from '../modules/file/FileService'
import { Ok, UnwrapForTest } from '../types'
import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeUser from '../__tests__/fixtures/user'
import makeAddDCR, { UNAUTHORIZED } from './addDCR'
import { InMemoryEventStore } from '../infra/inMemory'
import { ProjectDCRSubmitted } from '../modules/project/events'

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

const date = Date.now()
const numeroDossier = 'numero dossier'

const fakeFileContents = {
  path: 'fakeFile.pdf',
  stream: Readable.from('test-content'),
}

describe('addDCR use-case', () => {
  describe('when the user has rights on this project', () => {
    const eventStore = new InMemoryEventStore()
    let updatedProject: Project
    const originalProject: Project = UnwrapForTest(
      makeProject(
        makeFakeProject({
          classe: 'Classé',
          notifiedOn: Date.now() - 40 * 24 * 3600 * 1000,
          dcrDueOn: Date.now(),
          regionProjet: 'Bretagne / Pays de la Loire',
          departementProjet: 'Loire-Atlantique',
        })
      )
    )

    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

    const projectDCRSubmittedHandler = jest.fn((event: ProjectDCRSubmitted) => null)

    beforeAll(async () => {
      eventStore.subscribe(ProjectDCRSubmitted.type, projectDCRSubmittedHandler)
      const shouldUserAccessProject = jest.fn(async () => true)
      mockFileServiceSave.mockClear()

      const addDCR = makeAddDCR({
        eventStore,
        fileService,
        findProjectById: async () => originalProject,
        saveProject: async (project: Project) => {
          updatedProject = project
          return Ok(null)
        },
        shouldUserAccessProject,
      })

      const res = await addDCR({
        file: fakeFileContents,
        date,
        numeroDossier,
        projectId: originalProject.id,
        user,
      })

      expect(res.is_ok()).toBe(true)
      if (res.is_err()) return

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId: originalProject.id,
      })
    })

    it('should update the project dcr* properties', async () => {
      // Get the latest version of the project
      expect(updatedProject).toBeDefined()

      expect(updatedProject.id).toEqual(originalProject.id)

      expect(updatedProject.dcrSubmittedOn / 1000).toBeCloseTo(Date.now() / 1000, 0)
      expect(updatedProject.dcrSubmittedBy).toEqual(user.id)
      expect(updatedProject.dcrDate).toEqual(date)

      // Expect the file to be saved
      expect(mockFileServiceSave).toHaveBeenCalled()
      expect(mockFileServiceSave.mock.calls[0][1].stream).toEqual(fakeFileContents.stream)
      const fakeFile = mockFileServiceSave.mock.calls[0][0]
      expect(fakeFile).toBeDefined()
      expect(updatedProject.dcrFileId).toEqual(fakeFile.id.toString())

      expect(updatedProject.history).toHaveLength(1)
      if (!updatedProject.history?.length) return
      expect(updatedProject.history[0].before).toEqual({
        dcrNumeroDossier: '',
        dcrSubmittedBy: '',
        dcrSubmittedOn: 0,
        dcrFileId: '',
        dcrDate: 0,
      })
      expect(updatedProject.history[0].after).toEqual({
        dcrSubmittedBy: user.id,
        dcrSubmittedOn: updatedProject.dcrSubmittedOn,
        dcrFileId: fakeFile.id.toString(),
        dcrNumeroDossier: numeroDossier,
        dcrDate: date,
      })
      expect(updatedProject.history[0].createdAt / 100).toBeCloseTo(Date.now() / 100, 0)
      expect(updatedProject.history[0].type).toEqual('dcr-submission')
      expect(updatedProject.history[0].userId).toEqual(user.id)
    })

    it('should trigger a ProjectDCRSubmitted event', async () => {
      await waitForExpect(() => {
        expect(projectDCRSubmittedHandler).toHaveBeenCalled()
        const projectDCRSubmittedEvent = projectDCRSubmittedHandler.mock.calls[0][0]
        expect(projectDCRSubmittedEvent.payload.projectId).toEqual(originalProject.id)

        const fakeFile = mockFileServiceSave.mock.calls[0][0]

        expect(projectDCRSubmittedEvent.payload.dcrDate).toEqual(new Date(date))
        expect(projectDCRSubmittedEvent.payload.fileId).toEqual(fakeFile.id.toString())
        expect(projectDCRSubmittedEvent.payload.numeroDossier).toEqual(numeroDossier)
        expect(projectDCRSubmittedEvent.payload.submittedBy).toEqual(user.id)
        expect(projectDCRSubmittedEvent.aggregateId).toEqual(originalProject.id)
      })
    })
  })

  describe('When the user doesnt have rights on the project', () => {
    it('should return an UNAUTHORIZED error if the user does not have the rights on this project', async () => {
      mockFileServiceSave.mockClear()
      const eventStore = new InMemoryEventStore()

      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

      const originalProject = UnwrapForTest(
        makeProject(
          makeFakeProject({
            classe: 'Classé',
            notifiedOn: Date.now() - 40 * 24 * 3600 * 1000,
            dcrDueOn: Date.now(),
            regionProjet: 'Bretagne / Pays de la Loire',
            departementProjet: 'Loire-Atlantique',
          })
        )
      )

      const shouldUserAccessProject = jest.fn(async () => false)

      const saveProject = jest.fn()

      const addDCR = makeAddDCR({
        eventStore,
        fileService,
        findProjectById: async () => originalProject,
        saveProject,
        shouldUserAccessProject,
      })

      const res = await addDCR({
        file: fakeFileContents,
        date,
        numeroDossier,
        projectId: originalProject.id,
        user,
      })

      expect(res.is_err()).toBe(true)
      if (res.is_ok()) return

      expect(shouldUserAccessProject).toHaveBeenCalledWith({
        user,
        projectId: originalProject.id,
      })

      expect(saveProject).not.toHaveBeenCalled()
      expect(mockFileServiceSave).not.toHaveBeenCalled()

      expect(res.unwrap_err()).toEqual(new Error(UNAUTHORIZED))
    })
  })
})
