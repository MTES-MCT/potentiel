import { beforeEach, describe, expect, it } from '@jest/globals';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { resetDatabase } from '../../../helpers';
import { Project } from '../../../projectionsNext';
import { getProjectDataForProjectPage } from './getProjectDataForProjectPage';
import { v4 as uuid } from 'uuid';
import { User } from '../../../../../entities';
import { UserRole } from '../../../../../modules/users';

describe(`Récupérer les données relatives au prix de référence d'un projet`, () => {
  const projetId = uuid();
  const roleAutorisés: Array<UserRole> = [
    'admin',
    'porteur-projet',
    'dreal',
    'acheteur-obligé',
    'dgec-validateur',
    'cre',
  ];
  const roleNonAutorisés: Array<UserRole> = ['ademe', 'caisse-des-dépôts'];

  beforeEach(async () => {
    await resetDatabase();

    await Project.create(
      makeFakeProject({
        id: projetId,
        appelOffreId: 'Fessenheim',
        notifiedOn: 1234,
        prixReference: 90,
      }),
    );
  });

  describe(`Ne pas récupérer les données sur le prix de référence pour les utilisateurs non autorisés`, () => {
    for (const role of roleNonAutorisés) {
      it(`Étant donné un projet avec un prix de référence
            Quand un utilisateur ${role} récupère les données d'un projet
            Alors le prix de référence ne devrait pas être récupéré`, async () => {
        const donnéesProjet = (
          await getProjectDataForProjectPage({
            projectId: projetId,
            user: { role } as User,
          })
        )._unsafeUnwrap();

        expect(donnéesProjet.prixReference).toBeUndefined();
      });
    }
  });

  describe(`Récupérer les données sur le prix de référence pour les utilisateurs autorisés`, () => {
    for (const role of roleAutorisés) {
      it(`Étant donné un projet avec un prix de référence
            Quand un utilisateur ${role} récupère les données d'un projet
            Alors le prix de référence devrait être récupéré`, async () => {
        const donnéesProjet = (
          await getProjectDataForProjectPage({
            projectId: projetId,
            user: { role } as User,
          })
        )._unsafeUnwrap();

        expect(donnéesProjet.prixReference).toEqual(90);
      });
    }
  });
});
