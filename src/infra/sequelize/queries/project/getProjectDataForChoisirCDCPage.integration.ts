import { describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../core/domain';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { resetDatabase } from '../../helpers';
import { Project } from "../../projectionsNext";
import { getProjectDataForChoisirCDCPage } from './getProjectDataForChoisirCDCPage';
import { getProjectAppelOffre } from '../../../../config/queryProjectAO.config';
import { ProjectDataForChoisirCDCPage } from '../../../../modules/project';

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

    const expected: Partial<ProjectDataForChoisirCDCPage> = {
      id: projetId,
      appelOffre: getProjectAppelOffre({
        appelOffreId: 'Fessenheim',
        periodeId: '1',
        familleId: '1',
      }),
      cahierDesChargesActuel: '30/07/2021',
    };

    const readModel = await getProjectDataForChoisirCDCPage(projetId);

    expect(readModel.isOk()).toBe(true);

    expect(readModel._unsafeUnwrap()).toMatchObject(expected);
  });
});
