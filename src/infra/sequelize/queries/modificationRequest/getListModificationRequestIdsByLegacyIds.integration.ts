import { beforeEach, describe, expect, it } from '@jest/globals';
import { UniqueEntityID } from '../../../../core/domain';
import makeFakeProject from '../../../../__tests__/fixtures/project';
import makeFakeModificationRequest from '../../../../__tests__/fixtures/modificationRequest';
import { resetDatabase } from '../../helpers';
import { ModificationRequest, Project } from '../../projectionsNext';
import { getListModificationRequestIdsByLegacyIds } from './getListModificationRequestIdsByLegacyIds';

describe('Query getListModificationRequestIdsByLegacyIds', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  const projetALegacyId = new UniqueEntityID().toString();
  const projetBLegacyId = new UniqueEntityID().toString();
  describe(`Récupérer une liste d'identifiants de demande de modification à partir d'une liste d'identifiants technique de projets `, () => {
    it(`
      Étant donné une liste de projets et une liste d'identifiants techniques qui ciblent plusieurs de ces projets
      Lorsqu'on recherche les identifiants de demande de modification de plusieurs projets à partir de leurs identifiants technique
      Alors une liste d'identifiants de demande de modification doit être retournée
      `, async () => {
      const modificationRequestAId = new UniqueEntityID().toString();

      const modificationRequestBId = new UniqueEntityID().toString();

      await Project.bulkCreate([
        makeFakeProject({
          id: projetALegacyId,
        }),
        makeFakeProject({
          id: projetBLegacyId,
        }),
      ]);
      await ModificationRequest.bulkCreate([
        makeFakeModificationRequest({
          id: modificationRequestAId,
          projectId: projetALegacyId,
        }),
        makeFakeModificationRequest({
          id: modificationRequestBId,
          projectId: projetBLegacyId,
        }),
      ]);

      const résultat = await getListModificationRequestIdsByLegacyIds([
        projetALegacyId,
        projetBLegacyId,
      ]);

      expect(résultat).toEqual([modificationRequestAId, modificationRequestBId]);
    });
  });

  describe(`Impossible de récupérer une liste d'identifiants de demande de modification si aucun projet n'est trouvé à partir des identifiants technique`, () => {
    it(`
      Étant donné une liste de projets et une liste d'identifiants technique qui ne correspondent à aucun de ces projets
      Lorsqu'on recherche les identifiants de demande de modification de plusieurs projets à partir de leurs identifiants technique
      Alors aucun identifiant de demande de modification ne doit être retourné
      `, async () => {
      const résultat = await getListModificationRequestIdsByLegacyIds([
        projetALegacyId,
        projetBLegacyId,
      ]);

      expect(résultat).toEqual([]);
    });
  });
});
