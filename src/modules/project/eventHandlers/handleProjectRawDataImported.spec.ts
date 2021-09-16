import { FindProjectByIdentifiers, ProjectImported, ProjectNotificationDateSet } from '..'
import { UniqueEntityID } from '../../../core/domain'
import { okAsync } from '../../../core/utils'
import {
  fakeRepo,
  fakeTransactionalRepo,
  makeFakeProject,
} from '../../../__tests__/fixtures/aggregates'
import { ProjectRawDataImported } from '../events'
import { Project } from '../Project'
import { handleProjectRawDataImported } from './handleProjectRawDataImported'

const fakeProjectData = {
  appelOffreId: 'appelOffreId',
  periodeId: 'periodeId',
  familleId: 'familleId',
  numeroCRE: 'numeroCRE',
  nomProjet: 'nomProjet',
  nomCandidat: 'nomCandidat',
  puissance: 1.234,
  prixReference: 3.456,
  note: 10.1,
  nomRepresentantLegal: 'nomRepresentantLegal',
  email: 'test@test.test',
  adresseProjet: 'adresseProjet',
  codePostalProjet: '69100 / 01390',
  departementProjet: 'Rhône / Ain',
  regionProjet: 'Auvergne-Rhône-Alpes',
  communeProjet: 'communeProjet',
  classe: 'Eliminé',
  motifsElimination: 'motifsElimination',
  isInvestissementParticipatif: false,
  isFinancementParticipatif: false,
  notifiedOn: 0,
  engagementFournitureDePuissanceAlaPointe: false,
  territoireProjet: '',
  evaluationCarbone: 230.5,
  details: {
    Autre: 'valeur',
  },
}

describe('handleProjectRawDataImported', () => {
  const importId = new UniqueEntityID().toString()

  describe('when the project already exists', () => {
    const projectId = new UniqueEntityID()
    const findProjectByIdentifiers: FindProjectByIdentifiers = jest.fn((args) =>
      okAsync(projectId.toString())
    )
    const fakeProject = { ...makeFakeProject(), id: projectId }
    const projectRepo = {
      ...fakeTransactionalRepo(fakeProject as Project),
      ...fakeRepo(fakeProject as Project),
    }

    beforeAll(async () => {
      await handleProjectRawDataImported({
        findProjectByIdentifiers,
        projectRepo,
      })(
        new ProjectRawDataImported({
          payload: {
            importId,
            data: fakeProjectData,
          },
        })
      )
    })

    it('should call Project.reimport with the new data', () => {
      expect(fakeProject.reimport).toHaveBeenCalledWith({ data: fakeProjectData, importId })
    })
  })

  describe('when the project does not exist yet', () => {
    const findProjectByIdentifiers: FindProjectByIdentifiers = jest.fn((args) => okAsync(null))

    const projectRepo = { ...fakeTransactionalRepo<Project>(null), ...fakeRepo<Project>() }

    beforeAll(async () => {
      await handleProjectRawDataImported({
        findProjectByIdentifiers,
        projectRepo,
      })(
        new ProjectRawDataImported({
          payload: {
            importId,
            data: fakeProjectData,
          },
        })
      )
    })

    it('should call Project.import on a new Project aggregate', () => {
      const { appelOffreId, periodeId, familleId, numeroCRE } = fakeProjectData

      expect(projectRepo.save).toHaveBeenCalled()

      const savedProject = projectRepo.save.mock.calls[0][0]
      expect(savedProject.pendingEvents).toHaveLength(1)
      expect(savedProject.pendingEvents[0]).toBeInstanceOf(ProjectImported)
      expect(savedProject.pendingEvents[0].payload).toMatchObject({
        periodeId,
        appelOffreId,
        familleId,
        numeroCRE,
        importId,
        data: fakeProjectData,
      })
    })

    describe('when the project is already notified', () => {
      const projectRepo = { ...fakeTransactionalRepo<Project>(), ...fakeRepo<Project>() }

      const notifiedOn = 1631786848940

      beforeAll(async () => {
        await handleProjectRawDataImported({
          findProjectByIdentifiers,
          projectRepo,
        })(
          new ProjectRawDataImported({
            payload: {
              importId,
              data: { ...fakeProjectData, notifiedOn },
            },
          })
        )
      })

      it('should also call Project.setNotificationDate', () => {
        expect(projectRepo.save).toHaveBeenCalled()

        const savedProject = projectRepo.save.mock.calls[0][0]

        const targetEvent = savedProject.pendingEvents.find(
          (item) => item.type === ProjectNotificationDateSet.type
        ) as ProjectNotificationDateSet | undefined
        expect(targetEvent).toBeDefined()
        if (!targetEvent) return
        expect(targetEvent.payload.notifiedOn).toEqual(notifiedOn)
      })

      it('should still call Project.import', () => {
        const savedProject = projectRepo.save.mock.calls[0][0]
        expect(
          savedProject.pendingEvents.find((item) => item.type === ProjectImported.type)
        ).toBeDefined()
      })
    })
  })
})
