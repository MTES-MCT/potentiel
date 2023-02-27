import makeFakeProject from '../../../../../__tests__/fixtures/project';
import { resetDatabase } from '../../../helpers';
import models from '../../../models';
import { getProjectDataForProjectPage } from './getProjectDataForProjectPage';
import { v4 as uuid } from 'uuid';
import { User } from '@entities';
import { UserRole } from '@modules/users';

const { Project } = models;

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
      it(`Étant donné un projet Innovation,
          Lorsqu'un utilisateur ${role} récupère les données du projet,
          alors les notes innovation ne devraient pas être retournées`, async () => {
        const donnéesProjet = await getProjectDataForProjectPage({
          projectId: projetId,
          user: { role } as User,
        });

        expect(donnéesProjet.isOk()).toBe(true);

        expect(donnéesProjet._unsafeUnwrap().notePrix).toBeUndefined();
        expect(donnéesProjet._unsafeUnwrap().notesInnovation).toBeUndefined();
      });
    }
  });

  describe(`Cas d'utilisateurs avec la permission`, () => {
    for (const role of rôlesAvecAccèsAuxNotesInnovation) {
      it(`Étant donné un projet innovation,
          lorsqu'un utilisateur ${role} récupère les données du projet,
          alors les notes innovation devraient être retournées,
          et les notes devraient être arrondies,
          et le retour devrait êtrr 'N/A' pour les notes inexistantes`, async () => {
        const donnéesProjet = await getProjectDataForProjectPage({
          projectId: projetId,
          user: { role } as User,
        });

        expect(donnéesProjet.isOk()).toBe(true);

        expect(donnéesProjet._unsafeUnwrap().notePrix).toEqual('15');
        expect(donnéesProjet._unsafeUnwrap().notesInnovation).toBeDefined();
        expect(donnéesProjet._unsafeUnwrap().notesInnovation?.note).toEqual('20.33'); // note arrondie
        expect(donnéesProjet._unsafeUnwrap().notesInnovation?.degréInnovation).toEqual('N/A'); // note absente
        expect(donnéesProjet._unsafeUnwrap().note).toEqual(10);
        expect(donnéesProjet._unsafeUnwrap().notesInnovation?.positionnement).toEqual('8');
        expect(donnéesProjet._unsafeUnwrap().notesInnovation?.qualitéTechnique).toEqual('16');
        expect(
          donnéesProjet._unsafeUnwrap().notesInnovation?.adéquationAmbitionsIndustrielles,
        ).toEqual('12');
        expect(
          donnéesProjet._unsafeUnwrap().notesInnovation?.aspectsEnvironnementauxEtSociaux,
        ).toEqual('4');
      });
    }
  });
});
