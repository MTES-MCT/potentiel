import { okAsync } from '../core/utils'
import { makeProject, makeUser, Project } from '../entities'
import { StoredEvent, EventBus } from '../modules/eventStore'
import { ProjectDCRRemoved } from '../modules/project/events'
import { InfraNotAvailableError } from '../modules/shared'
import { Ok, UnwrapForTest } from '../types'
import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeUser from '../__tests__/fixtures/user'
import makeRemoveDCR, { UNAUTHORIZED } from './removeDCR'

const fakePublish = jest.fn((event: StoredEvent) => okAsync<null, InfraNotAvailableError>(null))

const fakeEventBus: EventBus = {
  publish: fakePublish,
  subscribe: jest.fn(),
}

describe('removeDCR use-case', () => {
  describe('when the user is porteur-projet', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

    describe('when the user has rights on this project', () => {
      const shouldUserAccessProject = jest.fn(async () => true)

      describe('when DCR have been added to project', () => {
        const originalProject: Project = UnwrapForTest(
          makeProject(
            makeFakeProject({
              dcrSubmittedOn: 1234,
              dcrSubmittedBy: 'id123',
              dcrNumeroDossier: 'dossier123',
              dcrFileId: 'fichier123',
              dcrDate: 123,
            })
          )
        )

        const projectDCRRemovedHandler = jest.fn((event: ProjectDCRRemoved) => null)

        fakePublish.mockClear()
        const saveProject = jest.fn(async (project: Project) => Ok(null))
        const removeDCR = makeRemoveDCR({
          eventBus: fakeEventBus,
          findProjectById: async () => originalProject,
          shouldUserAccessProject,
          saveProject,
        })

        beforeAll(async () => {
          const res = await removeDCR({
            user,
            projectId: originalProject.id,
          })

          expect(res.is_ok()).toEqual(true)
          if (res.is_err()) return

          expect(shouldUserAccessProject).toHaveBeenCalledWith({
            user,
            projectId: originalProject.id,
          })
        })

        it('should remove DCR information on the project', async () => {
          expect(saveProject).toHaveBeenCalledTimes(1)
          const updatedProject = saveProject.mock.calls[0][0]
          if (!updatedProject) return

          expect(updatedProject.id).toEqual(originalProject.id)

          expect(updatedProject.dcrSubmittedOn).toEqual(0)
          expect(updatedProject.dcrSubmittedBy).toEqual(undefined)
          expect(updatedProject.dcrNumeroDossier).toEqual(undefined)
          expect(updatedProject.dcrFileId).toEqual(undefined)
          expect(updatedProject.dcrDate).toEqual(0)

          expect(updatedProject.history).toHaveLength(1)
          if (!updatedProject.history?.length) return
          expect(updatedProject.history[0].before).toEqual({
            dcrSubmittedOn: 1234,
            dcrSubmittedBy: 'id123',
            dcrNumeroDossier: 'dossier123',
            dcrFileId: 'fichier123',
            dcrDate: 123,
          })
          expect(updatedProject.history[0].after).toEqual({
            dcrSubmittedOn: 0,
            dcrSubmittedBy: undefined,
            dcrNumeroDossier: undefined,
            dcrFileId: undefined,
            dcrDate: 0,
          })
          expect(updatedProject.history[0].createdAt / 100).toBeCloseTo(Date.now() / 100, 0)
          expect(updatedProject.history[0].type).toEqual('dcr-removal')
          expect(updatedProject.history[0].userId).toEqual(user.id)
        })

        it('should trigger a ProjectDCRRemoved event', async () => {
          expect(fakePublish).toHaveBeenCalled()
          const targetEvent = fakePublish.mock.calls
            .map((call) => call[0])
            .find((event) => event.type === ProjectDCRRemoved.type) as ProjectDCRRemoved

          expect(targetEvent).toBeDefined()
          if (!targetEvent) return

          expect(targetEvent.payload.projectId).toEqual(originalProject.id)

          expect(targetEvent.payload.removedBy).toEqual(user.id)
          expect(targetEvent.aggregateId).toEqual(originalProject.id)
        })
      })

      describe('when DCR have not been added to project', () => {
        const originalProject: Project = UnwrapForTest(
          makeProject(
            makeFakeProject({
              dcrSubmittedOn: 0,
              dcrSubmittedBy: undefined,
              dcrNumeroDossier: undefined,
              dcrFileId: undefined,
              dcrDate: 0,
            })
          )
        )

        it('should not update the project and return ok', async () => {
          fakePublish.mockClear()
          const saveProject = jest.fn(async (project: Project) => Ok(null))
          const removeDCR = makeRemoveDCR({
            eventBus: fakeEventBus,
            findProjectById: async () => originalProject,
            shouldUserAccessProject,
            saveProject,
          })

          const res = await removeDCR({
            user,
            projectId: originalProject.id,
          })

          expect(res.is_ok()).toEqual(true)
          if (res.is_err()) return

          expect(shouldUserAccessProject).toHaveBeenCalledWith({
            user,
            projectId: originalProject.id,
          })

          expect(saveProject).not.toHaveBeenCalled()
          expect(fakePublish).not.toHaveBeenCalled()
        })
      })
    })

    describe('when the user has no rights on this project', () => {
      it('should return an UNAUTHORIZED error', async () => {
        fakePublish.mockClear()
        const shouldUserAccessProject = jest.fn(async () => false)
        const saveProject = jest.fn()
        const removeDCR = makeRemoveDCR({
          eventBus: fakeEventBus,
          findProjectById: jest.fn(),
          shouldUserAccessProject,
          saveProject,
        })

        const res = await removeDCR({
          user,
          projectId: '1234',
        })

        expect(res.is_err()).toEqual(true)
        if (res.is_ok()) return
        expect(res.unwrap_err().message).toEqual(UNAUTHORIZED)

        expect(shouldUserAccessProject).toHaveBeenCalled()
        expect(saveProject).not.toHaveBeenCalled()
        expect(fakePublish).not.toHaveBeenCalled()
      })
    })
  })

  describe('when the user is not porteur de projet', () => {
    it('should return an UNAUTHORIZED error', async () => {
      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))
      fakePublish.mockClear()
      const shouldUserAccessProject = jest.fn()
      const saveProject = jest.fn()
      const removeDCR = makeRemoveDCR({
        eventBus: fakeEventBus,
        findProjectById: jest.fn(),
        shouldUserAccessProject,
        saveProject,
      })

      const res = await removeDCR({
        user,
        projectId: '1234',
      })

      expect(res.is_err()).toEqual(true)
      if (res.is_ok()) return
      expect(res.unwrap_err().message).toEqual(UNAUTHORIZED)

      expect(shouldUserAccessProject).not.toHaveBeenCalled()
      expect(saveProject).not.toHaveBeenCalled()
      expect(fakePublish).not.toHaveBeenCalled()
    })
  })
})
