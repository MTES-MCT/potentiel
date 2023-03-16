import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { resetDatabase } from '../../../helpers';
import { Project, Raccordements, GestionnaireRéseau } from '@infra/sequelize/projectionsNext';
import { getProjectDataForProjectPage } from './getProjectDataForProjectPage';
import { v4 as uuid } from 'uuid';
import { User } from '@entities';

describe(`Récupérer les données de consultation d'un projet`, () => {
  let projetId: string;
  let identifiantGestionnaire: string;

  beforeEach(async () => {
    await resetDatabase();
    projetId = uuid();
    identifiantGestionnaire = 'identifiant';

    await Project.create(
      makeFakeProject({
        id: projetId,
        appelOffreId: 'Fessenheim',
        notifiedOn: 1234,
      }),
    );

    await Raccordements.create({
      projetId,
      id: uuid(),
      identifiantGestionnaire,
      codeEICGestionnaireRéseau: 'codeEIC',
    });

    await GestionnaireRéseau.create({
      codeEIC: 'codeEIC',
      raisonSociale: 'ENEDIS',
    });
  });

  describe(`Données de gestionnaire de réseau`, () => {
    describe(`Ne pas récupérer les données de gestionnaire de réseau pour les ademe, caisse des dépôts`, () => {
      for (const role of ['ademe', 'caisse-des-dépôts']) {
        it(`Lorsqu'un utilisateur ${role} récupère les données d'un projet
            Alors aucune donnée de gestionnaire de réseau ne devrait être récupérée`, async () => {
          const donnéesProjet = (
            await getProjectDataForProjectPage({
              projectId: projetId,
              user: { role } as User,
            })
          )._unsafeUnwrap();

          expect(donnéesProjet.gestionnaireDeRéseau).toBeUndefined();
        });
      }
    });

    describe(`Ne pas récupérer les données de gestionnaire de réseau si aucun identifiant n'est renseigné`, () => {
      it(`Étant donné un projet sans identifiant de gestionnaire de réseau
            Lorsqu'un porteur de projet récupère les données d'un projet
            Alors aucune donnée de gestionnaire de réseau ne devrait être récupérée`, async () => {
        const projetId = uuid();

        await Project.create(
          makeFakeProject({
            id: projetId,
            appelOffreId: 'Fessenheim',
            notifiedOn: 1234,
          }),
        );

        const donnéesProjet = (
          await getProjectDataForProjectPage({
            projectId: projetId,
            user: { role: 'admin' } as User,
          })
        )._unsafeUnwrap();

        expect(donnéesProjet.gestionnaireDeRéseau).toBeUndefined();
      });
    });

    describe(`Récupérer les données de gestionnaire de réseau pour tous les utilisateurs sauf les ademe et caisse des dépôts`, () => {
      for (const role of [
        'admin',
        'porteur-projet',
        'dreal',
        'acheteur-obligé',
        'dgec-validateur',
        'cre',
      ]) {
        it(`Lorsqu'un utilisateur ${role} récupère les données d'un projet
            Alors les données de gestionnaire de réseau devrait être récupérées`, async () => {
          const donnéesProjet = await getProjectDataForProjectPage({
            projectId: projetId,
            user: { role } as User,
          });

          expect(donnéesProjet.isOk()).toBe(true);

          expect(donnéesProjet._unsafeUnwrap().gestionnaireDeRéseau).toEqual({
            identifiantGestionnaire,
            codeEICGestionnaireRéseau: 'codeEIC',
            raisonSocialeGestionnaireRéseau: 'ENEDIS',
          });
        });
      }
    });
  });
});
