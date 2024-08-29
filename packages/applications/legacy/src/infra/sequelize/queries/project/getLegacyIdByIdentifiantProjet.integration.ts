import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../core/domain';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import { resetDatabase } from '../../helpers';
import { Project } from '../../projectionsNext';
import { getLegacyProjetByIdentifiantProjet } from './getLegacyProjetByIdentifiantProjet';
import { IdentifiantProjet } from '@potentiel-domain/common';

describe('Query getLegacyProjetByIdentifiantProjet', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  const identifiantNaturel: Pick<
    IdentifiantProjet.ValueType,
    'appelOffre' | 'famille' | 'numéroCRE' | 'période'
  > = {
    appelOffre: 'CRE4 - Bâtiment',
    période: '1',
    famille: '1',
    numéroCRE: 'PROJETA',
  };

  describe(`Récupérer l'identifiant technique d'un projet à partir d'un identifiant naturel`, () => {
    it(`
      Étant donné une liste de projets et un identifiant naturel qui cible un de ces projets
      Lorsqu'on recherche l'identifiant technique d'un projet à partir d'un identifiant naturel
      Alors l'identifiant technique de celui-ci doit être retourné
      `, async () => {
      const projetLegacyId = new UniqueEntityID().toString();

      await Project.create({
        ...makeFakeProject(),
        id: projetLegacyId,
        appelOffreId: identifiantNaturel.appelOffre,
        periodeId: identifiantNaturel.période,
        familleId: identifiantNaturel.famille as string,
        numeroCRE: identifiantNaturel.numéroCRE,
      });

      const résultat = await getLegacyProjetByIdentifiantProjet(identifiantNaturel);

      expect(résultat).toMatchObject({ id: projetLegacyId });
    });
  });

  describe(`Impossible de récupérer l'identifiant technique si aucun projet trouvé à partir d'un identifiant naturel`, () => {
    it(`
      Étant donné une liste de projets et un identifiant technqiue cible ne correspondant à aucun des projets
      Lorsqu'on recherche l'identifiant technique d'un projet à partir de son identifiant naturel
      Alors aucun identifiant technique ne doit être retourné
      `, async () => {
      const résultat = await getLegacyProjetByIdentifiantProjet(identifiantNaturel);

      expect(résultat).toBeNull();
    });
  });
});
