import { DomainEvent, TransactionalRepository, UniqueEntityID } from '../../../core/domain'
import { okAsync } from '../../../core/utils'
import { InfraNotAvailableError } from '../../shared'
import { ProjectRawDataImported } from '../events'
import { handleProjectRawDataImported } from './handleProjectRawDataImported'
import {
  ProjectReimported,
  ProjectGFInvalidated,
  FindProjectByIdentifiers,
  ProjectImported,
} from '..'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { Project } from '../Project'
import { makeFakeEventBus } from '../../../__tests__/fixtures/aggregates/fakeEventBus'
import { EventBus } from '../../eventStore'

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
    const projectRepo = fakeTransactionalRepo(fakeProject as Project)
    const eventBus = makeFakeEventBus() as EventBus

    beforeAll(async () => {
      await handleProjectRawDataImported({
        findProjectByIdentifiers,
        projectRepo,
        eventBus,
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
    const projectRepo = fakeTransactionalRepo(null)
    const eventBus = makeFakeEventBus()

    beforeAll(async () => {
      await handleProjectRawDataImported({
        findProjectByIdentifiers,
        projectRepo,
        eventBus: eventBus as EventBus,
      })(
        new ProjectRawDataImported({
          payload: {
            importId,
            data: fakeProjectData,
          },
        })
      )
    })

    it('should emit ProjectImported', () => {
      expect(eventBus.publish).toHaveBeenCalledTimes(1)
      const targetEvent = eventBus.publish.mock.calls[0][0]

      const { appelOffreId, periodeId, familleId, numeroCRE } = fakeProjectData

      expect(targetEvent).toBeInstanceOf(ProjectImported)
      expect(targetEvent.payload).toMatchObject({
        periodeId,
        appelOffreId,
        familleId,
        numeroCRE,
        importId,
        data: fakeProjectData,
      })
    })
  })
})
