import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../core/domain';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { resetDatabase } from '../../helpers';
import { Project } from '../../projectionsNext';
import { IdentifiantProjet } from '@potentiel/domain';
import { getLegacyIdByIdentifiantProjet } from './getLegacyIdByIdentifiantProjet';

describe('Query getLegacyIdByIdentifiantProjet', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  const identifiantNaturelCible: IdentifiantProjet = {
    appelOffre: 'CRE4 - Bâtiment',
    période: '1',
    famille: '1',
    numéroCRE: 'PROJETA',
  };

  describe(`Récupérer l'identifiant technique d'un projet à partir d'un identifiant naturel`, () => {
    it(`
      Étant donné une liste de projets et un identifiant naturel qui cible un de ces projets
      Lorsqu'on recherche un l'identifiant technique d'un projet à partir d'un identifiant naturel
      Alors l'identifiant technique de celui-ci doit être retourné
      `, async () => {
      const projetLegacyId = new UniqueEntityID().toString();

      await Project.create({
        ...makeFakeProject(),
        id: projetLegacyId,
        appelOffreId: identifiantNaturelCible.appelOffre,
        periodeId: identifiantNaturelCible.période,
        familleId: identifiantNaturelCible.famille as string,
        numeroCRE: identifiantNaturelCible.numéroCRE,
      });

      const résultat = await getLegacyIdByIdentifiantProjet(identifiantNaturelCible);

      expect(résultat).toEqual(projetLegacyId);
    });
  });

  describe(`Récupérer null si aucun projet trouvé à partir d'un identifiants naturels`, () => {
    it(`
      Étant donné une liste de projets et une liste d'identifiants naturels cible ne correspondant aux projets existant
      Lorsqu'on recherche les projets correspondant à la liste d'identifiants naturels
      Alors une liste vide doit être retournée
      `, async () => {
      const résultat = await getLegacyIdByIdentifiantProjet(identifiantNaturelCible);

      expect(résultat).toEqual(null);
    });
  });

  // describe(`Récupérer une liste vide d'identifiants techniques à partir d'une liste d'identifiants naturels vide `, () => {
  //   it(`
  //     Étant donné une liste de projets et une liste d'identifiants naturels cible ne correspondant aux projets existant
  //     Lorsqu'on recherche les projets correspondant à la liste d'identifiants naturels
  //     Alors une liste vide doit être retournée
  //     `, async () => {
  //     expect(await getListLegacyIdByIdentifiantsProjes([])).toEqual([]);
  //   });
  // });
});
