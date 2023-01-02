import { appelsOffreStatic } from '@dataAccess/inMemory'
import { DREAL, makeProject, makeUser, Project } from '@entities'
import { UnwrapForTest } from '../../../types'
import makeFakeProject from '../../../__tests__/fixtures/project'
import makeFakeUser from '../../../__tests__/fixtures/user'
import { makeListProjects } from './listProjects'

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
const findDrealsForUser = jest.fn(async () => DREALs)

const listProjects = makeListProjects({
  searchForRegions,
  findAllForRegions,
  searchForUser,
  findAllForUser,
  searchAll,
  findAll,
  findDrealsForUser,
})

const resetMocks = () => {
  searchForRegions.mockClear()
  findAllForRegions.mockClear()
  searchForUser.mockClear()
  findAllForUser.mockClear()
  searchAll.mockClear()
  findAll.mockClear()
  findDrealsForUser.mockClear()
}

describe('listProjects use-case', () => {
  describe('Utilisateur admin', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })))

    describe('Etant donné une requête sans paramètres spécifiés', () => {
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
        expect(findDrealsForUser).not.toHaveBeenCalled()
      })

      it('Alors tous les projets notifiés devraient être retournés', async () => {
        expect(findAll).toHaveBeenCalledWith({ isNotified: true }, pagination)
        expect(res).toEqual(projectList)
      })
    })

    describe(`Etant donné un appel d'offres spécifié dans la recherche`, () => {
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

      it(`Alors tous les projets notifiés de l'appel d'offres devraient être retournés`, async () => {
        expect(findAll).toHaveBeenCalledWith({ appelOffreId, isNotified: true }, pagination)
        expect(res).toEqual(projectList)
      })
    })

    describe(`Etant donné une recherche filtrée par appel d'offres, periode, famille, classement et statut de garanties financières`, () => {
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

      it(`alors tous les projets notifiés de cet appel d'offres, periode, famille, classement et statut de garanties financieres devraient être retournés`, async () => {
        expect(findAll).toHaveBeenCalledWith(
          {
            appelOffreId,
            periodeId,
            familleId,
            isClasse: true,
            isAbandoned: false,
            garantiesFinancieres: 'submitted',
            isNotified: true,
          },
          pagination
        )
        expect(res).toEqual(projectList)
      })
    })

    describe(`Etant donné une recherche contenant un champ de recherche libre (barre de recherche)`, () => {
      let res: any

      beforeAll(async () => {
        resetMocks()

        res = await listProjects({
          user,
          recherche: 'champ-recherché',
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

      it(`Alors tous les projets notifiés correspondant à ce champ de recherche devraient être retournés`, async () => {
        expect(searchAll).toHaveBeenCalledWith('champ-recherché', { isNotified: true }, pagination)
        expect(res).toEqual(projectList)
      })
    })

    describe(`Etant donné une recherche contenant un appel d'offres, une période, une famille, un statut de projet, un statut de GF et un champ dans la barre de recherche`, () => {
      let res: any

      const appelOffreId = 'Fessenheim'
      const periodeId = '1'
      const familleId = '2'

      beforeAll(async () => {
        resetMocks()

        res = await listProjects({
          user,
          recherche: 'champ de recherche',
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

      it(`Alors tous les projets notifiés correspondants devraient être retournés`, async () => {
        expect(searchAll).toHaveBeenCalledWith(
          'champ de recherche',
          {
            appelOffreId,
            periodeId,
            familleId,
            isClasse: true,
            isAbandoned: false,
            garantiesFinancieres: 'submitted',
            isNotified: true,
          },
          pagination
        )
        expect(res).toEqual(projectList)
      })
    })
  })

  describe('Utilisateur Dreal', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'dreal' })))

    describe('Etant donné une requête sans paramètres spécifiés', () => {
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
      })

      it(`Alors tous les projets notifiés de la région devraient être retournés`, async () => {
        expect(findDrealsForUser).toHaveBeenCalledWith(user.id)
        expect(findAllForRegions).toHaveBeenCalledWith(DREALs, { isNotified: true }, pagination)
        expect(res).toEqual(projectList)
      })
    })

    describe(`Etant donné une recherche contenant un champ de recherche libre (barre de recherche)`, () => {
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
      })

      it(`Alors tous les projets notifiés de la région correspondant à ce champ de recherche devraient être retournés`, async () => {
        expect(findDrealsForUser).toHaveBeenCalledWith(user.id)
        expect(searchForRegions).toHaveBeenCalledWith(
          DREALs,
          'term',
          { isNotified: true },
          pagination
        )
        expect(res).toEqual(projectList)
      })
    })
  })

  describe('Utilisateur porteur de projets', () => {
    const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'porteur-projet' })))

    describe(`Etant donné une requête sans paramètres spécifiés`, () => {
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
        expect(findDrealsForUser).not.toHaveBeenCalled()
      })

      it(`Alors tous les projets notifiés rattachés à l'utilisateur devraient être retournés`, async () => {
        expect(findAllForUser).toHaveBeenCalledWith(user.id, { isNotified: true }, pagination)
        expect(res).toEqual(projectList)
      })
    })

    describe(`Etant donné une recherche contenant un champ de recherche libre (barre de recherche)`, () => {
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
        expect(findDrealsForUser).not.toHaveBeenCalled()
      })

      it(`Alors tous les projets notifiés rattachés à l'utilisateur et correspondant à ce champ de recherche devraient être retournés`, async () => {
        expect(searchForUser).toHaveBeenCalledWith(
          user.id,
          'term',
          { isNotified: true },
          pagination
        )
        expect(res).toEqual(projectList)
      })
    })
  })
})
