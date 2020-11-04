import models from '../../../models'
import { sequelize } from '../../../../../sequelize.config'
import makeFakeProject from '../../../../../__tests__/fixtures/project'
import { onProjectDataCorrected } from './onProjectDataCorrected'
import { ProjectDataCorrected } from '../../../../../modules/project/events'

const newValues = {
  numeroCRE: 'numeroCRE1',
  appelOffreId: 'appelOffreId1',
  periodeId: 'periodeId1',
  familleId: 'familleId1',
  nomProjet: 'nomProjet1',
  territoireProjet: 'territoire1',
  puissance: 123,
  prixReference: 456,
  evaluationCarbone: 321,
  note: 12.34,
  nomCandidat: 'nomCandidat1',
  nomRepresentantLegal: 'nomRepresentalLegal1',
  email: 'email1',
  adresseProjet: 'adresseProjet1',
  codePostalProjet: 'codePostalProjet1',
  communeProjet: 'communeProjet1',
  engagementFournitureDePuissanceAlaPointe: true,
  isFinancementParticipatif: true,
  isInvestissementParticipatif: false,
  motifsElimination: 'motifsElimination1',
}

describe('project.onProjectDataCorrected', () => {
  const fakeProjects = [
    {
      id: 'target',
      classe: 'Eliminé',
    },
  ].map(makeFakeProject)

  const ProjectModel = models.Project

  beforeAll(async () => {
    // Create the tables and remove all data
    await sequelize.sync({ force: true })

    await ProjectModel.bulkCreate(fakeProjects)
  })

  it('should update project details', async () => {
    await onProjectDataCorrected(models)(
      new ProjectDataCorrected({
        payload: {
          projectId: 'target',
          notifiedOn: 1,
          correctedData: { ...newValues, isClasse: true },
        },
      })
    )

    const updatedProject = await ProjectModel.findByPk('target')
    for (const [key, value] of Object.entries(newValues)) {
      console.log(
        'Checking key ' + key + ' for value ' + value + ' updatedProject[key] = ',
        updatedProject[key]
      )
      expect(updatedProject[key]).toEqual(value)
    }
  })
})
