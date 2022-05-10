import { getProjectDataForSignalerDemandeRecoursPage } from './getProjectDataForSignalerDemandeRecoursPage'
import { UniqueEntityID } from '@core/domain'
import makeFakeProject from '../../../../__tests__/fixtures/project'
import { resetDatabase } from '../../helpers'
import models from '../../models'

const { Project } = models
const projectId = new UniqueEntityID().toString()
const projectInfo = makeFakeProject({
  id: projectId,
  nomProjet: 'nomProjet',
  nomCandidat: 'candidat',
  communeProjet: 'communeProjet',
  regionProjet: 'regionProjet',
  departementProjet: 'departementProjet',
  periodeId: 'periodeId',
  familleId: 'familleId',
  appelOffreId: 'appelOffreId',
  abandonedOn: undefined,
})

describe('Sequelize getProjectDataForSignalerDemandeRecoursPage', () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  describe(`when Project has not been notified`, () => {
    it(`should return a ProjectDataForSignalerDemandeRecoursPage dto with status = 'non-notifié'`, async () => {
      await Project.create({ ...projectInfo, notifiedOn: undefined })

      const res = (await getProjectDataForSignalerDemandeRecoursPage({ projectId }))._unsafeUnwrap()

      expect(res).toMatchObject({
        id: projectId,
        nomProjet: 'nomProjet',
        status: 'non-notifié',
        nomCandidat: 'candidat',
        communeProjet: 'communeProjet',
        regionProjet: 'regionProjet',
        departementProjet: 'departementProjet',
        periodeId: 'periodeId',
        familleId: 'familleId',
        appelOffreId: 'appelOffreId',
      })
    })
  })

  describe(`when Project has been notified`, () => {
    const notifiedProject = {
      ...projectInfo,
      notifiedOn: new Date('2025-01-31').getTime(),
    }

    describe(`when Project has already been abandoned`, () => {
      it(`should return a ProjectDataForSignalerDemandeRecoursPage dto with status = 'abandonné'`, async () => {
        await Project.create({ ...notifiedProject, abandonedOn: new Date('2021-02-01').getTime() })

        const res = (
          await getProjectDataForSignalerDemandeRecoursPage({ projectId })
        )._unsafeUnwrap()

        expect(res).toMatchObject({
          id: projectId,
          nomProjet: 'nomProjet',
          status: 'abandonné',
          nomCandidat: 'candidat',
          communeProjet: 'communeProjet',
          regionProjet: 'regionProjet',
          departementProjet: 'departementProjet',
          periodeId: 'periodeId',
          familleId: 'familleId',
          appelOffreId: 'appelOffreId',
          abandonedOn: new Date('2021-02-01').getTime(),
        })
      })
    })

    describe(`when Project is 'Classé'`, () => {
      it(`should return a ProjectDataForSignalerDemandeRecoursPage dto with status = 'lauréat'`, async () => {
        await Project.create(makeFakeProject({ ...notifiedProject, classe: 'Classé' }))

        const res = (
          await getProjectDataForSignalerDemandeRecoursPage({ projectId })
        )._unsafeUnwrap()

        expect(res).toMatchObject({
          id: projectId,
          nomProjet: 'nomProjet',
          status: 'lauréat',
          nomCandidat: 'candidat',
          communeProjet: 'communeProjet',
          regionProjet: 'regionProjet',
          departementProjet: 'departementProjet',
          periodeId: 'periodeId',
          familleId: 'familleId',
          notifiedOn: new Date('2025-01-31').getTime(),
          appelOffreId: 'appelOffreId',
        })
      })
    })

    describe(`when Project is not 'Classé'`, () => {
      it(`should return a ProjectDataForSignalerDemandeRecoursPage dto with status = 'éliminé'`, async () => {
        await Project.create(makeFakeProject({ ...notifiedProject, classe: 'Eliminé' }))

        const res = (
          await getProjectDataForSignalerDemandeRecoursPage({ projectId })
        )._unsafeUnwrap()

        expect(res).toMatchObject({
          id: projectId,
          nomProjet: 'nomProjet',
          status: 'éliminé',
          nomCandidat: 'candidat',
          communeProjet: 'communeProjet',
          regionProjet: 'regionProjet',
          departementProjet: 'departementProjet',
          periodeId: 'periodeId',
          familleId: 'familleId',
          notifiedOn: new Date('2025-01-31').getTime(),
          appelOffreId: 'appelOffreId',
        })
      })
    })
  })
})
