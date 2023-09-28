import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../core/domain';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { resetDatabase } from '../../helpers';
import { Project } from '../../projectionsNext';
import { IdentifiantProjet } from '@potentiel/domain';
import { getIdentifiantProjetByLegacyId } from './getIdentifiantProjetByLegacyId';

describe('Query getIdentifiantProjetByLegacyId', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  const projetLegacyId = new UniqueEntityID().toString();

  describe(`Récupérer l'identifiant naturel d'un projet à partir d'un identifiant technique`, () => {
    it(`
      Étant donné une liste de projets et un identifiant technique qui cible un de ces projets
      Lorsqu'on recherche l'identifiant naturel d'un projet à partir d'un identifiant technique
      Alors l'identifiant naturel de celui-ci doit être retourné
      `, async () => {
      const identifiantNaturel: IdentifiantProjet = {
        appelOffre: 'CRE4 - Bâtiment',
        période: '1',
        famille: '1',
        numéroCRE: 'PROJETA',
      };

      await Project.create({
        ...makeFakeProject(),
        id: projetLegacyId,
        appelOffreId: identifiantNaturel.appelOffre,
        periodeId: identifiantNaturel.période,
        familleId: identifiantNaturel.famille as string,
        numeroCRE: identifiantNaturel.numéroCRE,
      });

      const résultat = await getIdentifiantProjetByLegacyId(projetLegacyId);

      expect(résultat).toStrictEqual(identifiantNaturel);
    });
  });

  describe(`Impossible de récupérer l'identifiant naturel si aucun projet trouvé à partir d'un identifiant technique`, () => {
    it(`
      Étant donné une liste de projets et un identifiant naturel cible ne correspondant à aucun des projets
      Lorsqu'on recherche l'identifiant naturel d'un projet à partir de son identifiant technique
      Alors aucun identifiant naturel ne doit être retourné
      `, async () => {
      const résultat = await getIdentifiantProjetByLegacyId(projetLegacyId);

      expect(résultat).toBeNull();
    });
  });
});
