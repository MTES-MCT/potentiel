import { UniqueEntityID } from '@core/domain';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { resetDatabase } from '../../helpers';
import models from '../../models';
import { getProjectDataForChoisirCDCPage } from './getProjectDataForChoisirCDCPage';
import { getProjectAppelOffre } from '@config/queryProjectAO.config';
import { Raccordements } from '@infra/sequelize';
import { ProjectDataForChoisirCDCPage } from '@modules/project';

const { Project } = models;
const projetId = new UniqueEntityID().toString();
const identifiantGestionnaire = 'identifiant';

describe('Récupérer les données pour la page du choix du cahier des charges', () => {
  it(`Lorsqu'on récupère les données pour la page du choix des CDC
      Alors l'identifiant du projet devrait être retourné
      Et l'appel d'offre pour le projet devrait être retrourné
      Et le cahier des charges actuel devrait être retourné`, async () => {
    await resetDatabase();

    await Project.create(
      makeFakeProject({
        id: projetId,
        appelOffreId: 'Fessenheim',
        periodeId: '1',
        familleId: 'familleId',
        classe: 'Classé',
        cahierDesChargesActuel: '30/07/2021',
      }),
    );

    await Raccordements.create({
      projetId,
      id: new UniqueEntityID().toString(),
      identifiantGestionnaire,
    });

    const res = (await getProjectDataForChoisirCDCPage(projetId))._unsafeUnwrap();

    const expected: Partial<ProjectDataForChoisirCDCPage> = {
      id: projetId,
      appelOffre: getProjectAppelOffre({ appelOffreId: 'Fessenheim', periodeId: '1' }),
      cahierDesChargesActuel: '30/07/2021',
      identifiantGestionnaireRéseau: identifiantGestionnaire,
    };

    expect(res).toMatchObject(expected);
  });
});
