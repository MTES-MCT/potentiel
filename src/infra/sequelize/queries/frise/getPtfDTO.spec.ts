import { User } from '@entities';
import { getPtfDTO } from './getPtfDTO';
import { makeDocumentUrl } from '../../../../views/components/timeline/helpers/makeDocumentUrl';
import { USER_ROLES } from '@modules/users';

describe(`Requête getPtfDTO`, () => {
  const rolesAutorisés = ['porteur-projet', 'admin', 'dgec-validateur', 'dreal'];
  describe(`Ne rien retourner si l'utlisateur n'a pas les droits`, () => {
    for (const role of USER_ROLES.filter((role) => !rolesAutorisés.includes(role))) {
      it(`Etant donné un utilisateur ${role}, 
      alors la pft ne devrait pas être retournée`, async () => {
        const utilisateur = { role } as User;
        const ptf = {
          ptfDateDeSignature: new Date(),
          ptfFichier: { filename: 'ptf-filename', id: 'file-id' },
        } as const;

        const résultat = await getPtfDTO({
          ptf: ptf,
          user: utilisateur,
          projetStatus: 'Classé',
        });

        expect(résultat).toBeUndefined();
      });
    }
  });

  describe(`Utilisateur ayant les droits pour visualiser les PTF`, () => {
    for (const role of rolesAutorisés) {
      const utilisateur = { role } as User;
      it(`Etant donné un projet éliminé avec une PTF
      alors la requête devrait retourner undefined`, async () => {
        const résultat = await getPtfDTO({
          ptf: {
            ptfDateDeSignature: new Date(),
            ptfFichier: { filename: 'ptf-filename', id: 'file-id' },
          },
          user: utilisateur,
          projetStatus: 'Eliminé',
        });

        expect(résultat).toBeUndefined();
      });

      it(`Etant donné un projet abandonné avec une PTF
      alors la requête devrait retourner undefined`, async () => {
        const résultat = await getPtfDTO({
          ptf: {
            ptfDateDeSignature: new Date(),
            ptfFichier: { filename: 'ptf-filename', id: 'file-id' },
          },
          user: utilisateur,
          projetStatus: 'Abandonné',
        });

        expect(résultat).toBeUndefined();
      });

      it(`Etant donné un projet classé sans PTF
      alors la requête devrait retourner un PtfDTO avec statut 'not-submitted'`, async () => {
        const résultat = await getPtfDTO({
          ptf: {
            ptfDateDeSignature: null,
            ptfFichier: null,
          },
          user: utilisateur,
          projetStatus: 'Classé',
        });

        expect(résultat).toMatchObject({
          type: 'proposition-technique-et-financière',
          statut: 'en-attente',
          variant: utilisateur.role,
        });
      });

      it(`Etant donné un projet classé avec une PTF
      alors la requête devrait retourner un PtfDTO avec statut 'submitted'`, async () => {
        const ptf = {
          ptfDateDeSignature: new Date(),
          ptfFichier: { filename: 'ptf-filename', id: 'file-id' },
        } as const;

        const résultat = await getPtfDTO({
          ptf: ptf,
          user: utilisateur,
          projetStatus: 'Classé',
        });

        expect(résultat).toMatchObject({
          type: 'proposition-technique-et-financière',
          statut: 'envoyée',
          variant: utilisateur.role,
          date: ptf.ptfDateDeSignature.getTime(),
          url: makeDocumentUrl(ptf.ptfFichier.id, ptf.ptfFichier.filename),
        });
      });
    }
  });
});
