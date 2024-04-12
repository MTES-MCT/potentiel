import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../core/domain';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { resetDatabase } from '../../helpers';
import { Project } from '../../projectionsNext';
import { getListIdentifiantsProjetByLegacyIds } from './getListIdentifiantsProjetByLegacyIds';
import { IdentifiantProjet } from '@potentiel-domain/common';

describe('Query getListIdentifiantsProjetByLegacyIds', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  describe(`Récupérer une liste d'identifiants naturels à partir d'une liste d'identifiants technique `, () => {
    it(`
      Étant donné une liste de projets et une liste d'identifiants technique qui ciblent plusieurs de ces projets
      Lorsqu'on recherche les identifiants naturel de plusieurs projets à partir de leurs identifiants technique
      Alors une liste d'identifiants naturel doit être retournée
      `, async () => {
      const projetALegacyId = new UniqueEntityID().toString();
      const projetBLegacyId = new UniqueEntityID().toString();

      const listeIdentifiantsNaturelCible: Pick<
        IdentifiantProjet.ValueType,
        'appelOffre' | 'famille' | 'numéroCRE' | 'période'
      >[] = [
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

      const résultat = await getListIdentifiantsProjetByLegacyIds([
        projetALegacyId,
        projetBLegacyId,
      ]);

      expect(résultat).toEqual(listeIdentifiantsNaturelCible);
    });
  });

  describe(`Impossible de récupérer une liste d'identifiants naturel si aucun projet n'est trouvé à partir d'une liste d'identifiants technique`, () => {
    it(`
      Étant donné une liste de projets et une liste d'identifiants technique qui ne correspondent à aucun de ces projets
      Lorsqu'on recherche les identifiants naturel de plusieurs projets à partir de leurs identifiants technique
      Alors aucun identifiant naturel ne doit être retourné
      `, async () => {
      const legacyId = new UniqueEntityID().toString();
      const résultat = await getListIdentifiantsProjetByLegacyIds([legacyId]);

      expect(résultat).toEqual([]);
    });
  });
});
