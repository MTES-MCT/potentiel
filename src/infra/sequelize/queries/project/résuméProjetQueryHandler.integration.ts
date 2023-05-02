import { UniqueEntityID } from '@core/domain';
import { Project } from '@infra/sequelize/projectionsNext';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { resetDatabase } from '../../helpers';
import { résuméProjetQueryHandler } from './résuméProjetQueryHandler';
import { RésuméProjetReadModel } from '@modules/project';

const projetId = new UniqueEntityID().toString();
const notifiedOn = new Date('2023-02-01').getTime();

const fakeProjet = makeFakeProject({ id: projetId, notifiedOn });

describe("Récupérer les données pour l'affichage du résumé d'un projet", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it(`Lorsqu'on récupère les données pour le résumé d'un projet,
      alors une liste définie de données devrait être retournée.`, async () => {
    await Project.create(fakeProjet);

    const résultat = await résuméProjetQueryHandler(projetId);
    expect(résultat.isOk()).toBe(true);

    const expected: RésuméProjetReadModel = {
      id: fakeProjet.id,
      nomProjet: fakeProjet.nomProjet,
      nomCandidat: fakeProjet.nomCandidat,
      communeProjet: fakeProjet.communeProjet,
      regionProjet: fakeProjet.regionProjet,
      departementProjet: fakeProjet.departementProjet,
      periodeId: fakeProjet.periodeId,
      familleId: fakeProjet.familleId,
      notifiedOn,
      appelOffreId: fakeProjet.appelOffreId,
      puissance: fakeProjet.puissance,
      unitePuissance: 'MWc',
    };

    expect(résultat._unsafeUnwrap()).toEqual(expected);
  });
});
