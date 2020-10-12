import makeListGarantiesFinancieres from './listGarantiesFinancieres'

import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeUser from '../__tests__/fixtures/user'

import { makeProject, makeUser, Project, User, DREAL } from '../entities'
import { UnwrapForTest } from '../types'
import { toGarantiesFinancieresList } from '../modules/project/mappers'

const pagination = {
  page: 0,
  pageSize: 10,
}

const makePaginatedProjectList = (projects: Project[]) => ({
  items: projects,
  pagination,
  pageCount: 1,
  itemCount: projects.length,
})

describe('listGarantiesFinancieres use-case', () => {
  describe('given user is dreal', () => {
    const user = { id: 'user1', role: 'dreal' } as User
    const fakeProject = UnwrapForTest(makeProject(makeFakeProject()))

    const userRegions: DREAL[] = ['Bretagne', 'Corse']

    const findAllProjectsForRegions = jest.fn(async () =>
      makePaginatedProjectList([fakeProject])
    )
    const findAllProjects = jest.fn()
    const findDrealsForUser = jest.fn(async () => userRegions)

    const listGarantiesFinancieres = makeListGarantiesFinancieres({
      findAllProjectsForRegions,
      findAllProjects,
      findDrealsForUser,
    })

    it('should return a list of projects with garanties financières for the user regions', async () => {
      const res = await listGarantiesFinancieres({ user })
      expect(res).toEqual(toGarantiesFinancieresList([fakeProject]))

      expect(findDrealsForUser).toHaveBeenCalledWith(user.id)
      expect(findAllProjectsForRegions).toHaveBeenCalledWith(userRegions, {
        garantiesFinancieres: 'submitted',
      })
      expect(findAllProjects).not.toHaveBeenCalled()
    })
  })

  describe('given user is admin', () => {
    const user = { id: 'user1', role: 'admin' } as User
    const fakeProject = UnwrapForTest(makeProject(makeFakeProject()))

    const findAllProjectsForRegions = jest.fn()
    const findAllProjects = jest.fn(async () =>
      makePaginatedProjectList([fakeProject])
    )
    const findDrealsForUser = jest.fn()

    const listGarantiesFinancieres = makeListGarantiesFinancieres({
      findAllProjectsForRegions,
      findAllProjects,
      findDrealsForUser,
    })

    it('should return a list of all projects with garanties financières', async () => {
      const res = await listGarantiesFinancieres({ user })
      expect(res).toEqual(toGarantiesFinancieresList([fakeProject]))

      expect(findAllProjects).toHaveBeenCalledWith({
        garantiesFinancieres: 'submitted',
      })
      expect(findDrealsForUser).not.toHaveBeenCalled()
      expect(findAllProjectsForRegions).not.toHaveBeenCalled()
    })
  })
})
