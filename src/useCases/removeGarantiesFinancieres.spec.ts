import moment from 'moment'
import {
  makeProject,
  makeProjectAdmissionKey,
  makeUser,
  Project,
} from '../entities'
import routes from '../routes'
import { Ok, UnwrapForTest } from '../types'
import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeUser from '../__tests__/fixtures/user'
import makeRemoveGarantiesFinancieres, {
  UNAUTHORIZED,
} from './removeGarantiesFinancieres'

describe('removeGarantiesFinancieres use-case', () => {
  describe('when the user is porteur-projet', () => {
    const user = UnwrapForTest(
      makeUser(makeFakeUser({ role: 'porteur-projet' }))
    )

    describe('when the user has rights on this project', () => {
      const shouldUserAccessProject = jest.fn(async () => true)

      describe('when garanties financières have been added to project', () => {
        const originalProject: Project = UnwrapForTest(
          makeProject(
            makeFakeProject({
              garantiesFinancieresSubmittedOn: 1234,
              garantiesFinancieresSubmittedBy: 'id123',
              garantiesFinancieresFile: 'file123',
              garantiesFinancieresDate: 123,
            })
          )
        )

        it('should remove garanties financieres information on the project', async () => {
          const saveProject = jest.fn(async (project: Project) => Ok(null))
          const removeGarantiesFinancieres = makeRemoveGarantiesFinancieres({
            findProjectById: async () => originalProject,
            shouldUserAccessProject,
            saveProject,
          })

          const res = await removeGarantiesFinancieres({
            user,
            projectId: originalProject.id,
          })

          expect(res.is_ok()).toEqual(true)
          if (res.is_err()) return

          expect(shouldUserAccessProject).toHaveBeenCalledWith({
            user,
            projectId: originalProject.id,
          })

          expect(saveProject).toHaveBeenCalledTimes(1)
          const updatedProject = saveProject.mock.calls[0][0]
          if (!updatedProject) return

          expect(updatedProject.id).toEqual(originalProject.id)

          expect(updatedProject.garantiesFinancieresSubmittedOn).toEqual(0)
          expect(updatedProject.garantiesFinancieresSubmittedBy).toEqual(
            undefined
          )
          expect(updatedProject.garantiesFinancieresFile).toEqual(undefined)
          expect(updatedProject.garantiesFinancieresDate).toEqual(0)

          expect(updatedProject.history).toHaveLength(1)
          if (!updatedProject.history?.length) return
          expect(updatedProject.history[0].before).toEqual({
            garantiesFinancieresSubmittedOn: 1234,
            garantiesFinancieresSubmittedBy: 'id123',
            garantiesFinancieresFile: 'file123',
            garantiesFinancieresDate: 123,
          })
          expect(updatedProject.history[0].after).toEqual({
            garantiesFinancieresSubmittedOn: 0,
            garantiesFinancieresSubmittedBy: undefined,
            garantiesFinancieresFile: undefined,
            garantiesFinancieresDate: 0,
          })
          expect(updatedProject.history[0].createdAt / 100).toBeCloseTo(
            Date.now() / 100,
            0
          )
          expect(updatedProject.history[0].type).toEqual(
            'garanties-financieres-removal'
          )
          expect(updatedProject.history[0].userId).toEqual(user.id)
        })
      })

      describe('when garanties financières have not been added to project', () => {
        const originalProject: Project = UnwrapForTest(
          makeProject(
            makeFakeProject({
              garantiesFinancieresSubmittedOn: 0,
              garantiesFinancieresSubmittedBy: undefined,
              garantiesFinancieresFile: undefined,
              garantiesFinancieresDate: 0,
            })
          )
        )

        it('should not update the project and return ok', async () => {
          const saveProject = jest.fn(async (project: Project) => Ok(null))
          const removeGarantiesFinancieres = makeRemoveGarantiesFinancieres({
            findProjectById: async () => originalProject,
            shouldUserAccessProject,
            saveProject,
          })

          const res = await removeGarantiesFinancieres({
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
        const shouldUserAccessProject = jest.fn(async () => false)
        const saveProject = jest.fn()
        const removeGarantiesFinancieres = makeRemoveGarantiesFinancieres({
          findProjectById: jest.fn(),
          shouldUserAccessProject,
          saveProject,
        })

        const res = await removeGarantiesFinancieres({
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

      const shouldUserAccessProject = jest.fn()
      const saveProject = jest.fn()
      const removeGarantiesFinancieres = makeRemoveGarantiesFinancieres({
        findProjectById: jest.fn(),
        shouldUserAccessProject,
        saveProject,
      })

      const res = await removeGarantiesFinancieres({
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
