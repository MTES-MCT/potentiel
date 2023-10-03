import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../core/domain';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { resetDatabase } from '../../helpers';
import { Project } from '../../projectionsNext';
import { IdentifiantProjet } from '@potentiel/domain';
import { getListLegacyIdsByIdentifiantsProjet } from './getListLegacyIdsByIdentifiantsProjet';

describe('Query getListLegacyIdByIdentifiantsProjet', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  describe(`Récupérer une liste d'identifiants techniques à partir d'une liste d'identifiants naturel `, () => {
    it(`
      Étant donné une liste de projets et une liste d'identifiants naturel qui ciblent plusieurs de ces projets
      Lorsqu'on recherche les identifiants technique de plusieurs projets à partir de leurs identifiants naturel
      Alors une liste d'identifiants technique doit être retournée
      `, async () => {
      const projetALegacyId = new UniqueEntityID().toString();
      const projetBLegacyId = new UniqueEntityID().toString();

      const listeIdentifiantsNaturelCible: IdentifiantProjet[] = [
        {
          appelOffre: 'CRE4 - Bâtiment',
          période: '1',
          famille: '1',
          numéroCRE: 'PROJETA',
        },
        {
          appelOffre: 'CRE4 - Bâtiment',
          période: '1',
          famille: '1',
          numéroCRE: 'PROJETB',
        },
      ];

      await Project.bulkCreate(
        [
          {
            id: projetALegacyId,
            appelOffreId: listeIdentifiantsNaturelCible[0].appelOffre,
            periodeId: listeIdentifiantsNaturelCible[0].période,
            familleId: listeIdentifiantsNaturelCible[0].famille,
            numeroCRE: listeIdentifiantsNaturelCible[0].numéroCRE,
          },
          {
            id: projetBLegacyId,
            appelOffreId: listeIdentifiantsNaturelCible[1].appelOffre,
            periodeId: listeIdentifiantsNaturelCible[1].période,
            familleId: listeIdentifiantsNaturelCible[1].famille,
            numeroCRE: listeIdentifiantsNaturelCible[1].numéroCRE,
          },
        ].map(makeFakeProject),
      );

      const résultat = await getListLegacyIdsByIdentifiantsProjet(listeIdentifiantsNaturelCible);

      expect(résultat).toEqual([projetALegacyId, projetBLegacyId]);
    });
  });

  describe(`Impossible de récupérer une liste d'identifiants naturel si aucun projet n'est trouvé à partir des identifiants technique`, () => {
    it(`
      Étant donné une liste de projets et une liste d'identifiants technqiue qui ne correspondent à aucun de ces projets
      Lorsqu'on recherche les identifiants naturel de plusieurs projets à partir de leurs identifiants technique
      Alors aucun identifiant technique ne doit être retourné
      `, async () => {
      const identifiantNaturel: IdentifiantProjet = {
        appelOffre: 'CRE4 - Bâtiment',
        période: '1',
        famille: '1',
        numéroCRE: 'PROJETA',
      };

      const résultat = await getListLegacyIdsByIdentifiantsProjet([identifiantNaturel]);

      expect(résultat).toEqual([]);
    });
  });
});
