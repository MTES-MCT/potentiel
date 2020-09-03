import { appelsOffreStatic } from '../dataAccess/inMemory'
import { DREAL, makeProject, makeUser, Project } from '../entities'
import { UnwrapForTest } from '../types'
import makeFakeProject from '../__tests__/fixtures/project'
import makeFakeUser from '../__tests__/fixtures/user'
import makeListProjects from './listProjects'

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

const project = UnwrapForTest(makeProject(makeFakeProject()))
const projectList = makePaginatedProjectList([project])
const appelsOffres = appelsOffreStatic.map((item) => item.id).slice(0, 2)
const periodes = appelsOffreStatic[0].periodes.map((item) => item.id)
const familles = appelsOffreStatic[0].familles.map((item) => item.id)
const DREALs: DREAL[] = ['Bretagne', 'Corse']

const searchForRegions = jest.fn(async () => projectList)
const findAllForRegions = jest.fn(async () => projectList)
const searchForUser = jest.fn(async () => projectList)
const findAllForUser = jest.fn(async () => projectList)
const searchAll = jest.fn(async () => projectList)
const findAll = jest.fn(async () => projectList)
const findExistingAppelsOffres = jest.fn(async () => appelsOffres)
const findExistingPeriodesForAppelOffre = jest.fn(async () => periodes)
const findExistingFamillesForAppelOffre = jest.fn(async () => familles)
const findDrealsForUser = jest.fn(async () => DREALs)

const listProjects = makeListProjects({
  searchForRegions,
  findAllForRegions,
  searchForUser,
  findAllForUser,
  searchAll,
  findAll,
  findExistingAppelsOffres,
  findExistingPeriodesForAppelOffre,
  findExistingFamillesForAppelOffre,
  findDrealsForUser,
})

const resetMocks = () => {
  searchForRegions.mockClear()
  findAllForRegions.mockClear()
  searchForUser.mockClear()
  findAllForUser.mockClear()
  searchAll.mockClear()
  findAll.mockClear()
  findExistingAppelsOffres.mockClear()
  findExistingPeriodesForAppelOffre.mockClear()
  findExistingFamillesForAppelOffre.mockClear()
  findDrealsForUser.mockClear()
}

describe('listProjects use-case', () => {
  describe('given the user is admin', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))

    describe('given no params', () => {
      let res: any

      beforeAll(async () => {
        resetMocks()

        res = await listProjects({
          user,
          pagination,
        })

        expect(res).toBeDefined()

        expect(searchForRegions).not.toHaveBeenCalled()
        expect(findAllForRegions).not.toHaveBeenCalled()
        expect(searchForUser).not.toHaveBeenCalled()
        expect(findAllForUser).not.toHaveBeenCalled()
        expect(searchAll).not.toHaveBeenCalled()
        expect(findExistingPeriodesForAppelOffre).not.toHaveBeenCalled()
        expect(findExistingFamillesForAppelOffre).not.toHaveBeenCalled()
        expect(findDrealsForUser).not.toHaveBeenCalled()
      })

      it('should return all notified projects', async () => {
        expect(findAll).toHaveBeenCalledWith({ isNotified: true }, pagination)

        expect(res).toHaveProperty('projects')
        expect(res.projects).toEqual(projectList)
      })

      it('should return appels offre that contain at least one unnotified project', () => {
        expect(findExistingAppelsOffres).toHaveBeenCalledWith({
          isNotified: true,
        })

        expect(res).toHaveProperty('existingAppelsOffres')
        expect(res.existingAppelsOffres).toEqual(appelsOffres)
      })
    })

    describe('given an appel offre', () => {
      let res: any
      const appelOffreId = 'Fessenheim'

      beforeAll(async () => {
        resetMocks()

        res = await listProjects({
          user,
          appelOffreId,
          pagination,
        })

        expect(res).toBeDefined()

        expect(searchForRegions).not.toHaveBeenCalled()
        expect(findAllForRegions).not.toHaveBeenCalled()
        expect(searchForUser).not.toHaveBeenCalled()
        expect(findAllForUser).not.toHaveBeenCalled()
        expect(searchAll).not.toHaveBeenCalled()
        expect(findDrealsForUser).not.toHaveBeenCalled()
      })

      it('should return all notified projects from this appel offre', async () => {
        expect(findAll).toHaveBeenCalledWith(
          { appelOffreId, isNotified: true },
          pagination
        )

        expect(res).toHaveProperty('projects')
        expect(res.projects).toEqual(projectList)
      })

      it('should return periodes from this appel offre that contain at least one unnotified project', () => {
        expect(findExistingPeriodesForAppelOffre).toHaveBeenCalledWith(
          appelOffreId,
          {
            isNotified: true,
          }
        )

        expect(res).toHaveProperty('existingPeriodes')
        expect(res.existingPeriodes).toEqual(periodes)
      })

      it('should return familles from this appel offre that contain at least one unnotified project', () => {
        expect(findExistingFamillesForAppelOffre).toHaveBeenCalledWith(
          appelOffreId,
          {
            isNotified: true,
          }
        )

        expect(res).toHaveProperty('existingFamilles')
        expect(res.existingFamilles).toEqual(familles)
      })
    })

    describe('given appel offre, periode, famille, classement and garantiesFinancieres params', () => {
      let res: any
      const appelOffreId = 'Fessenheim'
      const periodeId = '1'
      const familleId = '2'

      beforeAll(async () => {
        resetMocks()

        res = await listProjects({
          user,
          appelOffreId,
          periodeId,
          familleId,
          classement: 'classés',
          garantiesFinancieres: 'submitted',
          pagination,
        })

        expect(res).toBeDefined()

        expect(searchForRegions).not.toHaveBeenCalled()
        expect(findAllForRegions).not.toHaveBeenCalled()
        expect(searchForUser).not.toHaveBeenCalled()
        expect(findAllForUser).not.toHaveBeenCalled()
        expect(searchAll).not.toHaveBeenCalled()
        expect(findDrealsForUser).not.toHaveBeenCalled()
      })

      it('should return all notified projects from this appel offre, periode, famille, classement and garanties financieres', async () => {
        expect(findAll).toHaveBeenCalledWith(
          {
            appelOffreId,
            periodeId,
            familleId,
            isClasse: true,
            garantiesFinancieres: 'submitted',
            isNotified: true,
          },
          pagination
        )

        expect(res).toHaveProperty('projects')
        expect(res.projects).toEqual(projectList)
      })
    })

    describe('given only a search term', () => {
      let res: any

      beforeAll(async () => {
        resetMocks()

        res = await listProjects({
          user,
          recherche: 'term',
          pagination,
        })

        expect(res).toBeDefined()

        expect(searchForRegions).not.toHaveBeenCalled()
        expect(findAllForRegions).not.toHaveBeenCalled()
        expect(searchForUser).not.toHaveBeenCalled()
        expect(findAllForUser).not.toHaveBeenCalled()
        expect(findAll).not.toHaveBeenCalled()
        expect(findExistingPeriodesForAppelOffre).not.toHaveBeenCalled()
        expect(findExistingFamillesForAppelOffre).not.toHaveBeenCalled()
        expect(findDrealsForUser).not.toHaveBeenCalled()
      })

      it('should return all notified projects that contain the search term', async () => {
        expect(searchAll).toHaveBeenCalledWith(
          'term',
          { isNotified: true },
          pagination
        )

        expect(res).toHaveProperty('projects')
        expect(res.projects).toEqual(projectList)
      })
    })

    describe('given a search term and appel offre, periode, famille, classement and garantiesFinancieres params', () => {
      let res: any

      const appelOffreId = 'Fessenheim'
      const periodeId = '1'
      const familleId = '2'

      beforeAll(async () => {
        resetMocks()

        res = await listProjects({
          user,
          recherche: 'term',
          appelOffreId,
          periodeId,
          familleId,
          classement: 'classés',
          garantiesFinancieres: 'submitted',
          pagination,
        })

        expect(res).toBeDefined()

        expect(searchForRegions).not.toHaveBeenCalled()
        expect(findAllForRegions).not.toHaveBeenCalled()
        expect(searchForUser).not.toHaveBeenCalled()
        expect(findAllForUser).not.toHaveBeenCalled()
        expect(findAll).not.toHaveBeenCalled()
        expect(findDrealsForUser).not.toHaveBeenCalled()
      })

      it('should return all notified projects from this appel offre, periode, famille, classement and garanties financieres that contain the search term', async () => {
        expect(searchAll).toHaveBeenCalledWith(
          'term',
          {
            appelOffreId,
            periodeId,
            familleId,
            isClasse: true,
            garantiesFinancieres: 'submitted',
            isNotified: true,
          },
          pagination
        )

        expect(res).toHaveProperty('projects')
        expect(res.projects).toEqual(projectList)
      })
    })
  })

  describe('given the user is dreal', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'dreal' })))

    describe('given no params', () => {
      let res: any

      beforeAll(async () => {
        resetMocks()

        res = await listProjects({
          user,
          pagination,
        })

        expect(res).toBeDefined()

        expect(searchForRegions).not.toHaveBeenCalled()
        expect(searchForUser).not.toHaveBeenCalled()
        expect(findAllForUser).not.toHaveBeenCalled()
        expect(findAll).not.toHaveBeenCalled()
        expect(searchAll).not.toHaveBeenCalled()
        expect(findExistingPeriodesForAppelOffre).not.toHaveBeenCalled()
        expect(findExistingFamillesForAppelOffre).not.toHaveBeenCalled()
      })

      it('should return all notified projects for the user DREALs', async () => {
        expect(findDrealsForUser).toHaveBeenCalledWith(user.id)
        expect(findAllForRegions).toHaveBeenCalledWith(
          DREALs,
          { isNotified: true },
          pagination
        )

        expect(res).toHaveProperty('projects')
        expect(res.projects).toEqual(projectList)
      })

      it('should return appels offre that contain at least one unnotified project in these regions', () => {
        expect(findExistingAppelsOffres).toHaveBeenCalledWith({
          regions: DREALs,
        })

        expect(res).toHaveProperty('existingAppelsOffres')
        expect(res.existingAppelsOffres).toEqual(appelsOffres)
      })
    })

    describe('given a search term', () => {
      let res: any

      beforeAll(async () => {
        resetMocks()

        res = await listProjects({
          user,
          recherche: 'term',
          pagination,
        })

        expect(res).toBeDefined()

        expect(findAllForRegions).not.toHaveBeenCalled()
        expect(searchForUser).not.toHaveBeenCalled()
        expect(findAllForUser).not.toHaveBeenCalled()
        expect(searchAll).not.toHaveBeenCalled()
        expect(findAll).not.toHaveBeenCalled()
        expect(findExistingPeriodesForAppelOffre).not.toHaveBeenCalled()
        expect(findExistingFamillesForAppelOffre).not.toHaveBeenCalled()
      })

      it('should return all notified projects from these regions that contain the search term', async () => {
        expect(findDrealsForUser).toHaveBeenCalledWith(user.id)
        expect(searchForRegions).toHaveBeenCalledWith(
          DREALs,
          'term',
          { isNotified: true },
          pagination
        )

        expect(res).toHaveProperty('projects')
        expect(res.projects).toEqual(projectList)
      })
    })
  })

  describe('given the user is porteur projet', () => {
    const user = UnwrapForTest(
      makeUser(makeFakeUser({ role: 'porteur-projet' }))
    )

    describe('given no params', () => {
      let res: any

      beforeAll(async () => {
        resetMocks()

        res = await listProjects({
          user,
          pagination,
        })

        expect(res).toBeDefined()

        expect(findAllForRegions).not.toHaveBeenCalled()
        expect(searchForRegions).not.toHaveBeenCalled()
        expect(searchForUser).not.toHaveBeenCalled()
        expect(findAll).not.toHaveBeenCalled()
        expect(searchAll).not.toHaveBeenCalled()
        expect(findExistingPeriodesForAppelOffre).not.toHaveBeenCalled()
        expect(findExistingFamillesForAppelOffre).not.toHaveBeenCalled()
        expect(findDrealsForUser).not.toHaveBeenCalled()
      })

      it('should return all notified projects for the user', async () => {
        expect(findAllForUser).toHaveBeenCalledWith(
          user.id,
          { isNotified: true },
          pagination
        )

        expect(res).toHaveProperty('projects')
        expect(res.projects).toEqual(projectList)
      })

      it('should return appels offre that contain at least one unnotified project for this user', () => {
        expect(findExistingAppelsOffres).toHaveBeenCalledWith({
          userId: user.id,
        })

        expect(res).toHaveProperty('existingAppelsOffres')
        expect(res.existingAppelsOffres).toEqual(appelsOffres)
      })
    })

    describe('given a search term', () => {
      let res: any

      beforeAll(async () => {
        resetMocks()

        res = await listProjects({
          user,
          recherche: 'term',
          pagination,
        })

        expect(res).toBeDefined()

        expect(findAllForRegions).not.toHaveBeenCalled()
        expect(searchForRegions).not.toHaveBeenCalled()
        expect(findAllForUser).not.toHaveBeenCalled()
        expect(findAll).not.toHaveBeenCalled()
        expect(searchAll).not.toHaveBeenCalled()
        expect(findExistingPeriodesForAppelOffre).not.toHaveBeenCalled()
        expect(findExistingFamillesForAppelOffre).not.toHaveBeenCalled()
        expect(findDrealsForUser).not.toHaveBeenCalled()
      })

      it('should return all notified projects for this user that contain the search term', async () => {
        expect(searchForUser).toHaveBeenCalledWith(
          user.id,
          'term',
          { isNotified: true },
          pagination
        )

        expect(res).toHaveProperty('projects')
        expect(res.projects).toEqual(projectList)
      })
    })
  })
})
