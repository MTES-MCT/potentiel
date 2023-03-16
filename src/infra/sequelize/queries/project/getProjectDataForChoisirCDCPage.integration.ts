import { UniqueEntityID } from '@core/domain';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { resetDatabase } from '../../helpers';
import { GestionnaireRéseau, Project, Raccordements } from '@infra/sequelize/projectionsNext';
import { getProjectDataForChoisirCDCPage } from './getProjectDataForChoisirCDCPage';
import { getProjectAppelOffre } from '@config/queryProjectAO.config';
import { ProjectDataForChoisirCDCPage } from '@modules/project';

const projetId = new UniqueEntityID().toString();

describe('Récupérer les données pour la page du choix du cahier des charges', () => {
  it(`Etant donné un projet ayant déjà un gestionnaire de réseau renseigné,
      lorsqu'on récupère les données pour la page du choix des CDC
      Alors devraient être retournés :
      - l'identifiant du projet,
      - le CDC actuel,
      - l'identifiant gestionnaire réseau si déjà renseigné,
      - le gestionnaire réseau actuel,
      - la liste des gestionnaires réseau`, async () => {
    await resetDatabase();

    await Project.create(
      makeFakeProject({
        id: projetId,
        appelOffreId: 'Fessenheim',
        periodeId: '1',
        familleId: '1',
        classe: 'Classé',
        cahierDesChargesActuel: '30/07/2021',
      }),
    );

    await Raccordements.create({
      projetId,
      id: new UniqueEntityID().toString(),
      identifiantGestionnaire: 'identifiant-gestionnaire',
      codeEICGestionnaireRéseau: 'code-eic-gestionnaire',
    });

    await GestionnaireRéseau.bulkCreate([
      {
        codeEIC: 'code-eic-gestionnaire',
        raisonSociale: 'raison-sociale-gestionnaire',
        format: 'format-identifiant',
        légende: 'légende-identifiant',
      },
      {
        codeEIC: 'code-eic-autre-gestionnaire',
        raisonSociale: 'raison-sociale-autre-gestionnaire',
        format: '',
        légende: '',
      },
    ]);

    const expected: Partial<ProjectDataForChoisirCDCPage> = {
      id: projetId,
      appelOffre: getProjectAppelOffre({
        appelOffreId: 'Fessenheim',
        periodeId: '1',
        familleId: '1',
      }),
      cahierDesChargesActuel: '30/07/2021',
      identifiantGestionnaireRéseau: 'identifiant-gestionnaire',
      gestionnaireRéseau: {
        codeEIC: 'code-eic-gestionnaire',
        raisonSociale: 'raison-sociale-gestionnaire',
      },
      listeGestionnairesRéseau: expect.arrayContaining([
        {
          codeEIC: 'code-eic-gestionnaire',
          raisonSociale: 'raison-sociale-gestionnaire',
          format: 'format-identifiant',
          légende: 'légende-identifiant',
        },
        {
          codeEIC: 'code-eic-autre-gestionnaire',
          raisonSociale: 'raison-sociale-autre-gestionnaire',
          format: null,
          légende: null,
        },
      ]),
    };

    const readModel = await getProjectDataForChoisirCDCPage(projetId);

    expect(readModel.isOk()).toBe(true);

    expect(readModel._unsafeUnwrap()).toMatchObject(expected);
  });
});
