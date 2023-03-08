import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { onProjectDataCorrected } from './onProjectDataCorrected';
import { ProjectDataCorrected } from '@modules/project';
import { resetDatabase } from '../../../helpers';
import { v4 as uuid } from 'uuid';
import { Project } from '@infra/sequelize/projectionsNext';

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
};

describe('project.onProjectDataCorrected', () => {
  const projectId = uuid();

  const fakeProjects = [
    {
      id: projectId,
      classe: 'Eliminé',
    },
  ].map(makeFakeProject);

  beforeAll(async () => {
    await resetDatabase();
    await Project.bulkCreate(fakeProjects);
  });

  it('should update project details', async () => {
    await onProjectDataCorrected(
      new ProjectDataCorrected({
        payload: {
          projectId,
          correctedBy: 'user1',
          correctedData: { ...newValues },
        },
      }),
    );

    const updatedProject = await Project.findByPk(projectId);
    expect(updatedProject).toMatchObject({
      ...newValues,
      evaluationCarboneDeRéférence: newValues.evaluationCarbone,
    });
  });
});
