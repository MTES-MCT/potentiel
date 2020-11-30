import { Readable } from 'stream'
import { Repository } from '../core/domain'
import { okAsync } from '../core/utils'
import { makeProject, makeUser, Project } from '../entities'
import { EventBus, StoredEvent } from '../modules/eventStore'
import { FileObject } from '../modules/file'
import { ProjectDCRSubmitted } from '../modules/project/events'
import { InfraNotAvailableError } from '../modules/shared'
import { Ok, UnwrapForTest } from '../types'
import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeUser from '../__tests__/fixtures/user'
import makeAddDCR, { UNAUTHORIZED } from './addDCR'

const date = Date.now()
const numeroDossier = 'numero dossier'

const fakeFileContents = {
  filename: 'fakeFile.pdf',
  contents: Readable.from('test-content'),
}

const fakePublish = jest.fn((event: StoredEvent) => okAsync<null, InfraNotAvailableError>(null))

const fakeEventBus: EventBus = {
  publish: fakePublish,
  subscribe: jest.fn(),
}

describe('addDCR use-case', () => {
  describe('when the user has rights on this project', () => {
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

    const fileRepo = {
      save: jest.fn((file: FileObject) => okAsync(null)),
      load: jest.fn(),
    }

    beforeAll(async () => {
      const shouldUserAccessProject = jest.fn(async () => true)
      fakePublish.mockClear()

      const addDCR = makeAddDCR({
        eventBus: fakeEventBus,
        fileRepo: fileRepo as Repository<FileObject>,
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
      expect(fileRepo.save).toHaveBeenCalled()
      expect(fileRepo.save.mock.calls[0][0].contents).toEqual(fakeFileContents.contents)
      const fakeFile = fileRepo.save.mock.calls[0][0]
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
      expect(fakePublish).toHaveBeenCalled()
      const targetEvent = fakePublish.mock.calls
        .map((call) => call[0])
        .find((event) => event.type === ProjectDCRSubmitted.type) as ProjectDCRSubmitted

      expect(targetEvent).toBeDefined()
      if (!targetEvent) return

      expect(targetEvent.payload.projectId).toEqual(originalProject.id)

      const fakeFile = fileRepo.save.mock.calls[0][0]

      expect(targetEvent.payload.dcrDate).toEqual(new Date(date))
      expect(targetEvent.payload.fileId).toEqual(fakeFile.id.toString())
      expect(targetEvent.payload.numeroDossier).toEqual(numeroDossier)
      expect(targetEvent.payload.submittedBy).toEqual(user.id)
      expect(targetEvent.aggregateId).toEqual(originalProject.id)
    })
  })

  describe('When the user doesnt have rights on the project', () => {
    it('should return an UNAUTHORIZED error if the user does not have the rights on this project', async () => {
      fakePublish.mockClear()

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

      const fileRepo = {
        save: jest.fn(),
        load: jest.fn(),
      }

      const addDCR = makeAddDCR({
        eventBus: fakeEventBus,
        fileRepo,
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
      expect(fileRepo.save).not.toHaveBeenCalled()
      expect(fakePublish).not.toHaveBeenCalled()

      expect(res.unwrap_err()).toEqual(new Error(UNAUTHORIZED))
    })
  })
})
