import { makeListerProjetsÀNotifier } from './listerProjetsÀNotifier'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { UnwrapForTest } from '../../../../../types'
import { appelOffreRepo, appelsOffreStatic } from '@dataAccess/inMemory'
import { isNotifiedPeriode, makeProject, Project } from '@entities'

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
  .filter((periode) => !!isNotifiedPeriode(periode))
  .map(makePeriodeDTO)

const listerProjetsNonNotifiés = jest.fn(async () => projectList)
const countUnnotifiedProjects = jest.fn(async () => 42)
const findExistingAppelsOffres = jest.fn(async () => appelsOffresDTOs.map((item) => item.id))
const findExistingPeriodesForAppelOffre = jest.fn(async () =>
  fessenheim.periodes.map((item) => item.id)
)

const listerProjetsÀNotifier = makeListerProjetsÀNotifier({
  findExistingAppelsOffres,
  findExistingPeriodesForAppelOffre,
  countUnnotifiedProjects,
  listerProjetsNonNotifiés,
  appelOffreRepo,
})

describe('Commande listerProjetsÀNotifier', () => {
  describe('Etant donné des projets non-notifiés dans la base', () => {
    it(`Lorsqu'une recherche est faite par appel d'offres et période,
        alors la liste de tous les projets non-notifiés de la période devraient être retournée`, async () => {
      const res = await listerProjetsÀNotifier({
        appelOffreId: fessenheim.id,
        periodeId: '2',
        pagination,
      })

      expect(res).toBeDefined()

      expect(listerProjetsNonNotifiés).toHaveBeenCalledWith(
        expect.objectContaining({
          pagination,
          filtres: {
            appelOffre: { appelOffreId: fessenheim.id, periodeId: '2' },
          },
        })
      )

      res && expect(res.projects).toEqual(projectList)
      res && expect(res.projectsInPeriodCount).toEqual(42)
    })

    it(`Lorsque la recherche est faite par appel d'offre (sans période), 
        alors une liste des périodes contenant des projets non-notifiées de l'appel d'offres devrait être retournée, 
        et la première des période de l'appel d'offres contenant des projets non-notifiés devrait être sélectionnée`, async () => {
      const res = await listerProjetsÀNotifier({
        appelOffreId: fessenheim.id,
        pagination,
      })

      expect(res).toBeDefined()

      res && expect(res.existingPeriodes).toEqual(validFessenheimPeriodes)

      expect(findExistingPeriodesForAppelOffre).toHaveBeenCalledWith(fessenheim.id, {
        isNotified: false,
      })

      // Pour l'AO Fessenheim la première période notifiable est la période 2
      res && expect(res.selectedPeriodeId).toEqual('2')
    })

    it(`Lorsqu'une recherche est faite avec une période invalide,
        alors la première période de l'appel d'offres concerné contenant des projets non notifiés devrait être sélectionnée`, async () => {
      const res = await listerProjetsÀNotifier({
        appelOffreId: fessenheim.id,
        periodeId: '1',
        pagination,
      })

      expect(res).toBeDefined()
      expect(findExistingPeriodesForAppelOffre).toHaveBeenCalledWith(fessenheim.id, {
        isNotified: false,
      })

      // Pour l'AO Fessenheim  il y a deux périodes notifiables
      res && expect(res.selectedPeriodeId).toEqual('2')
    })

    it(`Lorsqu'une recherche est faite sans appel d'offre spécifié,
        alors la liste de tous les AOs contenant des projets non notifiés devrait être retournée, 
        et le premier appel d'offres de cette liste devrait être sélectionné`, async () => {
      const res = await listerProjetsÀNotifier({
        pagination,
      })

      expect(res).toBeDefined()

      expect(findExistingAppelsOffres).toHaveBeenCalledWith({
        isNotified: false,
      })

      res && expect(res.existingAppelsOffres).toEqual(appelsOffresDTOs)

      res && expect(res.selectedAppelOffreId).toEqual(fessenheim.id)
    })

    describe('Recherche par classement', () => {
      it(`Etant donné une recherche sur les projets "classés",
          alors la liste de tous les projets non notifiés et classés de la période donnée devrait être retournée`, async () => {
        const res = await listerProjetsÀNotifier({
          appelOffreId: fessenheim.id,
          periodeId: '2',
          classement: 'classés',
          pagination,
        })

        expect(res).toBeDefined()
        expect(listerProjetsNonNotifiés).toHaveBeenCalledWith(
          expect.objectContaining({
            filtres: {
              appelOffre: { appelOffreId: fessenheim.id, periodeId: '2' },
              classement: 'classés',
            },
            pagination,
          })
        )
      })

      it(`Etant donné une recherche sur les projets "éliminés",
          alors la liste de tous les projets non notifiés et éliminés de la période donnée devrait être retournée`, async () => {
        const res = await listerProjetsÀNotifier({
          appelOffreId: fessenheim.id,
          periodeId: '2',
          classement: 'éliminés',
          pagination,
        })

        expect(res).toBeDefined()

        expect(listerProjetsNonNotifiés).toHaveBeenCalledWith(
          expect.objectContaining({
            filtres: {
              appelOffre: { appelOffreId: fessenheim.id, periodeId: '2' },
              classement: 'éliminés',
            },
            pagination,
          })
        )
      })
    })

    it(`Lorsqu'une recherche est faite sur un appel d'offres invalide, 
      alors le retour devrait être nul`, async () => {
      const res = await listerProjetsÀNotifier({
        appelOffreId: 'invalid',
        pagination,
      })

      expect(res).toBeDefined()
      expect(res).toEqual(null)
    })
  })

  describe('Etant donné une base sans aucun projet non-notifié', () => {
    it(`Lorsqu'une recherche est faite dans une base sans projet non-notifié,
      alors le retour devrait être nul`, async () => {
      findExistingAppelsOffres.mockImplementation(async () => [])

      const res = await listerProjetsÀNotifier({
        pagination,
      })

      expect(findExistingAppelsOffres).toHaveBeenCalledWith({
        isNotified: false,
      })
      expect(res).toEqual(null)
    })
  })
})
