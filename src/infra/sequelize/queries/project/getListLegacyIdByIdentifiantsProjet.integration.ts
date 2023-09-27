import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../core/domain';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { resetDatabase } from '../../helpers';
import { Project } from '../../projectionsNext';
import { IdentifiantProjet } from '@potentiel/domain';
import { getListLegacyIdByIdentifiantsProjes } from './getListLegacyIdByIdentifiantsProjet';

describe('Query getListLegacyIdByIdentifiantsProjet', () => {
  beforeEach(async () => {
    await resetDatabase();

    await Project.bulkCreate(
      [
        { id: new UniqueEntityID().toString(), appelOffreId: 'other' },
        { id: new UniqueEntityID().toString(), periodeId: 'other' },
        { id: new UniqueEntityID().toString(), familleId: 'other' },
        { id: new UniqueEntityID().toString(), numeroCRE: 'other' },
      ].map(makeFakeProject),
    );
  });

  describe(`Récupérer une liste d'identifiants techniques à partir d'une liste d'identifiants naturels `, () => {
    it(`
      Étant donné une liste de projets et une liste d'identifiants naturels cible correspondant aux projets existant
      Lorsqu'on recherche les projets correspondant à la liste d'identifiants naturels
      Alors une liste des identifiants technique doit être retournée
      `, async () => {
      const projetALegacyId = new UniqueEntityID().toString();
      const projetBLegacyId = new UniqueEntityID().toString();

      const listeIdentifiantsNaturelsCible: IdentifiantProjet[] = [
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
            appelOffreId: listeIdentifiantsNaturelsCible[0].appelOffre,
            periodeId: listeIdentifiantsNaturelsCible[0].période,
            familleId: listeIdentifiantsNaturelsCible[0].famille,
            numeroCRE: listeIdentifiantsNaturelsCible[0].numéroCRE,
          },
          {
            id: projetBLegacyId,
            appelOffreId: listeIdentifiantsNaturelsCible[1].appelOffre,
            periodeId: listeIdentifiantsNaturelsCible[1].période,
            familleId: listeIdentifiantsNaturelsCible[1].famille,
            numeroCRE: listeIdentifiantsNaturelsCible[1].numéroCRE,
          },
        ].map(makeFakeProject),
      );

      const résultat = await getListLegacyIdByIdentifiantsProjes(listeIdentifiantsNaturelsCible);

      expect(résultat).toEqual([projetALegacyId, projetBLegacyId]);
    });
  });

  describe(`Récupérer une liste vide d'identifiants techniques si aucun projet trouvé à partir d'une liste d'identifiants naturels`, () => {
    it(`
      Étant donné une liste de projets et une liste d'identifiants naturels cible ne correspondant aux projets existant
      Lorsqu'on recherche les projets correspondant à la liste d'identifiants naturels
      Alors une liste vide doit être retournée
      `, async () => {
      const listeIdentifiantsNaturelsCible: IdentifiantProjet[] = [
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

      const résultat = await getListLegacyIdByIdentifiantsProjes(listeIdentifiantsNaturelsCible);

      expect(résultat).toEqual([]);
    });
  });

  describe(`Récupérer une liste vide d'identifiants techniques à partir d'une liste d'identifiants naturels vide `, () => {
    it(`
      Étant donné une liste de projets et une liste d'identifiants naturels cible ne correspondant aux projets existant
      Lorsqu'on recherche les projets correspondant à la liste d'identifiants naturels
      Alors une liste vide doit être retournée
      `, async () => {
      expect(await getListLegacyIdByIdentifiantsProjes([])).toEqual([]);
    });
  });
});
