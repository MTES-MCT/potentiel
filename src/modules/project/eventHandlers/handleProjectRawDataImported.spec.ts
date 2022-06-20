import { FindProjectByIdentifiers } from '..'
import { UniqueEntityID } from '@core/domain'
import { okAsync } from '@core/utils'
import { fakeTransactionalRepo, makeFakeProject } from '../../../__tests__/fixtures/aggregates'
import { ProjectRawDataImported, ProjectRawDataImportedPayload } from '../events'
import { Project } from '../Project'
import { handleProjectRawDataImported } from './handleProjectRawDataImported'
import { GetProjectAppelOffre } from '@modules/projectAppelOffre'
import { ProjectAppelOffre } from '@entities'

const appelOffre = { id: 'appelOffreId' } as ProjectAppelOffre
const getProjectAppelOffre: GetProjectAppelOffre = () => appelOffre

const fakeProjectData = {
  appelOffreId: 'appelOffreId',
  periodeId: 'periodeId',
  familleId: 'familleId',
  numeroCRE: 'numeroCRE',
  nomProjet: 'nomProjet',
  nomCandidat: 'nomCandidat',
  actionnaire: 'actionnaire',
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
  technologie: 'N/A',
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

    beforeAll(async () => {
      await handleProjectRawDataImported({
        getProjectAppelOffre,
        findProjectByIdentifiers,
        projectRepo,
      })(
        new ProjectRawDataImported({
          payload: {
            importId,
            data: fakeProjectData,
          } as ProjectRawDataImportedPayload,
        })
      )
    })

    it('should call Project.import with the new data', () => {
      expect(fakeProject.import).toHaveBeenCalledWith({
        appelOffre,
        data: fakeProjectData,
        importId,
      })
    })
  })

  describe('when the project does not exist yet', () => {
    const projectId = new UniqueEntityID()
    const findProjectByIdentifiers: FindProjectByIdentifiers = jest.fn((args) => okAsync(null))

    const fakeProject = { ...makeFakeProject(), id: projectId }
    const projectRepo = fakeTransactionalRepo(fakeProject as Project)

    beforeAll(async () => {
      await handleProjectRawDataImported({
        getProjectAppelOffre,
        findProjectByIdentifiers,
        projectRepo,
      })(
        new ProjectRawDataImported({
          payload: {
            importId,
            data: fakeProjectData,
          } as ProjectRawDataImportedPayload,
        })
      )
    })

    it('should call Project.import with the data', () => {
      expect(fakeProject.import).toHaveBeenCalledWith({
        appelOffre,
        data: fakeProjectData,
        importId,
      })
    })
  })
})
