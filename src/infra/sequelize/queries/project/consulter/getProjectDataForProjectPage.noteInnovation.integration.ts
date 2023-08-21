import { beforeEach, describe, expect, it } from '@jest/globals';
import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { resetDatabase } from '../../../helpers';
import { Project } from '../../../projectionsNext';
import { getProjectDataForProjectPage } from './getProjectDataForProjectPage';
import { v4 as uuid } from 'uuid';
import { User } from '../../../../../entities';
import { UserRole } from '../../../../../modules/users';

describe(`Récupérer les données relatives aux notes pour les AO innovation`, () => {
  const rôlesAvecAccèsAuxNotesInnovation: Array<UserRole> = [
    'admin',
    'dgec-validateur',
    'ademe',
    'cre',
    'porteur-projet',
  ];

  const roleNonAutorisés: Array<UserRole> = ['dreal', 'acheteur-obligé', 'caisse-des-dépôts'];

  const projetId = uuid();
  beforeEach(async () => {
    await resetDatabase();

    await Project.create(
      makeFakeProject({
        id: projetId,
        appelOffreId: 'CRE4 - Innovation',
        notifiedOn: 1234,
        note: 10,
        details: {
          'Note prix': '15',
          'Note innovation\n(AO innovation)': '20,3333333',
          'Note positionnement sur le marché (/10pt)\n(AO innovation)': '8',
          'Note qualité technique (/5pt)\n(AO innovation)': '16',
          'Note adéquation du projet avec les ambitions industrielles (/5pt)\n(AO innovation)':
            '12',
          'Note aspects environnementaux et sociaux (/5pt)\n(AO innovation)': '4',
        },
      }),
    );
  });

  describe(`Cas d'utilisateurs sans la permission`, () => {
    for (const role of roleNonAutorisés) {
      it(`Étant donné un projet CRE4 Innovation,
          Lorsqu'un utilisateur ${role} récupère les données du projet,
          alors les notes innovation ne devraient pas être retournées`, async () => {
        const donnéesProjet = await getProjectDataForProjectPage({
          projectId: projetId,
          user: { role } as User,
        });

        expect(donnéesProjet.isOk()).toBe(true);

        const donnéesProjetUnwraped = donnéesProjet._unsafeUnwrap();

        expect(donnéesProjetUnwraped.notePrix).toBeUndefined();
        expect(donnéesProjetUnwraped.notesInnovation).toBeUndefined();
      });
    }
  });

  describe(`Cas d'utilisateurs avec la permission`, () => {
    for (const role of rôlesAvecAccèsAuxNotesInnovation) {
      it(`Étant donné un projet CRE4 Innovation,
          lorsqu'un utilisateur ${role} récupère les données du projet,
          alors les notes innovation devraient être retournées,
          et les notes devraient être arrondies,
          et le retour devrait être 'N/A' pour les notes inexistantes`, async () => {
        const donnéesProjet = await getProjectDataForProjectPage({
          projectId: projetId,
          user: { role } as User,
        });

        expect(donnéesProjet.isOk()).toBe(true);

        const donnéesProjetUnwraped = donnéesProjet._unsafeUnwrap();

        expect(donnéesProjetUnwraped.note).toEqual(10);
        expect(donnéesProjetUnwraped.notePrix).toEqual('15');
        expect(donnéesProjetUnwraped.notesInnovation).toEqual({
          note: '20.33', // note arrondie
          degréInnovation: 'N/A', // valeur N/A assignée
          positionnement: '8',
          qualitéTechnique: '16',
          adéquationAmbitionsIndustrielles: '12',
          aspectsEnvironnementauxEtSociaux: '4',
        });
      });
    }
  });
});
