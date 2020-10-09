import waitForExpect from 'wait-for-expect'
import { makeProject, makeUser, Project } from '../entities'
import { InMemoryEventStore } from '../infra/inMemory'
import { ProjectDCRRemoved } from '../modules/project/events'
import { Ok, UnwrapForTest } from '../types'
import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeUser from '../__tests__/fixtures/user'
import makeRemoveDCR, { UNAUTHORIZED } from './removeDCR'

describe('removeDCR use-case', () => {
  describe('when the user is porteur-projet', () => {
    const user = UnwrapForTest(
      makeUser(makeFakeUser({ role: 'porteur-projet' }))
    )

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

        const projectDCRRemovedHandler = jest.fn(
          (event: ProjectDCRRemoved) => null
        )

        const eventStore = new InMemoryEventStore()
        const saveProject = jest.fn(async (project: Project) => Ok(null))
        const removeDCR = makeRemoveDCR({
          eventStore,
          findProjectById: async () => originalProject,
          shouldUserAccessProject,
          saveProject,
        })

        beforeAll(async () => {
          eventStore.subscribe(ProjectDCRRemoved.type, projectDCRRemovedHandler)
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
          expect(updatedProject.history[0].createdAt / 100).toBeCloseTo(
            Date.now() / 100,
            0
          )
          expect(updatedProject.history[0].type).toEqual('dcr-removal')
          expect(updatedProject.history[0].userId).toEqual(user.id)
        })

        it('should trigger a ProjectDCRRemoved event', async () => {
          await waitForExpect(() => {
            expect(projectDCRRemovedHandler).toHaveBeenCalled()
            const projectDCRRemovedEvent =
              projectDCRRemovedHandler.mock.calls[0][0]
            expect(projectDCRRemovedEvent.payload.projectId).toEqual(
              originalProject.id
            )

            expect(projectDCRRemovedEvent.payload.removedBy).toEqual(user.id)
            expect(projectDCRRemovedEvent.aggregateId).toEqual(
              originalProject.id
            )
          })
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
          const eventStore = new InMemoryEventStore()
          const saveProject = jest.fn(async (project: Project) => Ok(null))
          const removeDCR = makeRemoveDCR({
            eventStore,
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
        })
      })
    })

    describe('when the user has no rights on this project', () => {
      it('should return an UNAUTHORIZED error', async () => {
        const eventStore = new InMemoryEventStore()
        const shouldUserAccessProject = jest.fn(async () => false)
        const saveProject = jest.fn()
        const removeDCR = makeRemoveDCR({
          eventStore,
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
      })
    })
  })

  describe('when the user is not porteur de projet', () => {
    it('should return an UNAUTHORIZED error', async () => {
      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))
      const eventStore = new InMemoryEventStore()
      const shouldUserAccessProject = jest.fn()
      const saveProject = jest.fn()
      const removeDCR = makeRemoveDCR({
        eventStore,
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
    })
  })
})
