import makeListUnnotifiedProjects from './listUnnotifiedProjects'

import makeFakeProject from '../__tests__/fixtures/project'

import { UnwrapForTest } from '../types'

import { appelOffreRepo, appelsOffreStatic } from '@dataAccess/inMemory'
import { makeProject, Project } from '@entities'

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

const fessenheim = appelsOffreStatic.find((item) => item.id === 'Fessenheim')

if (!fessenheim) throw new Error('Cannot find fessenheim in appelsOffre')

const makeAppelOffreDTO = (appelOffre) => ({
  id: appelOffre.id,
  shortTitle: appelOffre.shortTitle,
})

const appelsOffresDTOs = [
  makeAppelOffreDTO(fessenheim),
  ...appelsOffreStatic
    .map(makeAppelOffreDTO)
    .filter((item) => item.id !== 'Fessenheim')
    .slice(0, 2),
]

const makePeriodeDTO = (periode) => ({ id: periode.id, title: periode.title })
const validFessenheimPeriodes = fessenheim.periodes
  .filter((periode) => !!periode.isNotifiedOnPotentiel)
  .map(makePeriodeDTO)

const searchAll = jest.fn(async () => projectList)
const findAll = jest.fn(async () => projectList)
const countUnnotifiedProjects = jest.fn(async () => 42)
const findExistingAppelsOffres = jest.fn(async () => appelsOffresDTOs.map((item) => item.id))
const findExistingPeriodesForAppelOffre = jest.fn(async () =>
  fessenheim.periodes.map((item) => item.id)
)

const listUnnotifiedProjects = makeListUnnotifiedProjects({
  findExistingAppelsOffres,
  findExistingPeriodesForAppelOffre,
  countUnnotifiedProjects,
  findAllProjects: findAll,
  searchAllProjects: searchAll,
  appelOffreRepo,
})

const resetMocks = () => {
  searchAll.mockClear()
  findAll.mockClear()
  findExistingAppelsOffres.mockClear()
  findExistingPeriodesForAppelOffre.mockClear()
  countUnnotifiedProjects.mockClear()
}

describe('listUnnotifiedProjects use-case', () => {
  let res: any

  describe('given unnotified projects', () => {
    describe('given an appelOffre and a periode', () => {
      beforeAll(async () => {
        resetMocks()
        res = await listUnnotifiedProjects({
          appelOffreId: fessenheim.id,
          periodeId: '2',
          pagination,
        })

        expect(res).toBeDefined()
      })

      it('should return a list of all projects from this appelOffre and periode that have not been notified', () => {
        expect(findAll).toHaveBeenCalledWith(
          {
            appelOffreId: fessenheim.id,
            periodeId: '2',
            isNotified: false,
          },
          pagination
        )

        expect(res.projects).toEqual(projectList)
        expect(res.projectsInPeriodCount).toEqual(42)
      })
    })

    describe('given an appel offre but no periode', () => {
      beforeAll(async () => {
        resetMocks()
        res = await listUnnotifiedProjects({
          appelOffreId: fessenheim.id,
          pagination,
        })

        expect(res).toBeDefined()
      })

      it('should return a list of periodes from this appel offre which are available for notification on Potentiel', () => {
        expect(res.existingPeriodes).toEqual(validFessenheimPeriodes)
      })

      it('should select the first periode from the selected appel offre with unnotified projects and which is available for notification on Potentiel', () => {
        expect(findExistingPeriodesForAppelOffre).toHaveBeenCalledWith(fessenheim.id, {
          isNotified: false,
        })

        // For fessenheim, only periode 2 can be notified on Potentiel
        expect(res.selectedPeriodeId).toEqual('2')
      })
    })

    describe('given an appel offre and an invalid periode', () => {
      beforeAll(async () => {
        resetMocks()
        res = await listUnnotifiedProjects({
          appelOffreId: fessenheim.id,
          periodeId: '1',
          pagination,
        })

        expect(res).toBeDefined()
      })

      it('should select the first periode from the selected appel offre with unnotified projects and which is available for notification on Potentiel', () => {
        expect(findExistingPeriodesForAppelOffre).toHaveBeenCalledWith(fessenheim.id, {
          isNotified: false,
        })

        // For fessenheim, only periode 2 can be notified on Potentiel
        expect(res.selectedPeriodeId).toEqual('2')
      })
    })

    describe('given no appel offre', () => {
      beforeAll(async () => {
        resetMocks()
        res = await listUnnotifiedProjects({
          pagination,
        })

        expect(res).toBeDefined()
      })

      it('should return a list of all appels offre with unnotified projects', () => {
        expect(findExistingAppelsOffres).toHaveBeenCalledWith({
          isNotified: false,
        })

        expect(res.existingAppelsOffres).toEqual(appelsOffresDTOs)
      })

      it('should select the first appel offre with unnotified projects', () => {
        expect(res.selectedAppelOffreId).toEqual(fessenheim.id)
      })
    })

    describe('given search term', () => {
      beforeAll(async () => {
        resetMocks()
        res = await listUnnotifiedProjects({
          appelOffreId: fessenheim.id,
          periodeId: '2',
          recherche: 'term',
          pagination,
        })

        expect(res).toBeDefined()
      })

      it('should return a list of all projects from this appelOffre and periode that have not been notified and contain the search term', () => {
        expect(searchAll).toHaveBeenCalledWith(
          'term',
          {
            appelOffreId: fessenheim.id,
            periodeId: '2',
            isNotified: false,
          },
          pagination
        )
      })
    })

    describe('given classement filter', () => {
      describe('given classement is "classés"', () => {
        beforeAll(async () => {
          resetMocks()
          res = await listUnnotifiedProjects({
            appelOffreId: fessenheim.id,
            periodeId: '2',
            classement: 'classés',
            pagination,
          })

          expect(res).toBeDefined()
        })

        it('should return a list of all projects from this appelOffre and periode that have not been notified and are classé', () => {
          expect(findAll).toHaveBeenCalledWith(
            {
              appelOffreId: fessenheim.id,
              periodeId: '2',
              isNotified: false,
              isClasse: true,
            },
            pagination
          )
        })
      })

      describe('given classement is "éliminés"', () => {
        beforeAll(async () => {
          resetMocks()
          res = await listUnnotifiedProjects({
            appelOffreId: fessenheim.id,
            periodeId: '2',
            classement: 'éliminés',
            pagination,
          })

          expect(res).toBeDefined()
        })

        it('should return a list of all projects from this appelOffre and periode that have not been notified and are classé', () => {
          expect(findAll).toHaveBeenCalledWith(
            {
              appelOffreId: fessenheim.id,
              periodeId: '2',
              isNotified: false,
              isClasse: false,
            },
            pagination
          )
        })
      })
    })

    describe('given an invalid appel offre', () => {
      beforeAll(async () => {
        resetMocks()
        res = await listUnnotifiedProjects({
          appelOffreId: 'invalid',
          pagination,
        })

        expect(res).toBeDefined()
      })

      it('should return null', () => {
        expect(res).toEqual(null)
      })
    })
  })

  describe('given no unnotified projects', () => {
    it('should return null', async () => {
      findExistingAppelsOffres.mockImplementation(async () => [])

      res = await listUnnotifiedProjects({
        pagination,
      })

      expect(findExistingAppelsOffres).toHaveBeenCalledWith({
        isNotified: false,
      })
      expect(res).toEqual(null)
    })
  })
})
