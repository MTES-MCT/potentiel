import { getGarantiesFinancièresDataForProjectPage } from './getGarantiesFinancièresDataForProjectPage';
import { resetDatabase } from '@infra/sequelize/helpers';
import { UniqueEntityID } from '@core/domain';
import { User } from '@entities';
import { USER_ROLES } from '@modules/users';
import { GarantiesFinancières, User as UserModel, File } from '@infra/sequelize/projectionsNext';

describe(`Requête getGarantiesFinancièresDataForProjectPage`, () => {
  const projetId = new UniqueEntityID().toString();
  const GfId = new UniqueEntityID().toString();
  const dateLimiteEnvoi = new Date('2050-01-01');
  const dateEchéance = new Date();
  const envoyéesPar = new UniqueEntityID().toString();
  const dateConstitution = new Date();
  const fichierId = new UniqueEntityID().toString();

  beforeEach(async () => await resetDatabase());

  describe(`Rôles utilisateurs n'ayant pas les droits sur les garanties financières`, () => {
    for (const role of USER_ROLES.filter(
      (role) =>
        ![
          'porteur-projet',
          'admin',
          'dgec-validateur',
          'dreal',
          'caisse-des-dépôts',
          'cre',
        ].includes(role),
    )) {
      it(`Etant donné un projet soumis à garanties financières
          Si l'utlisateur a le rôle ${role},
          Alors il n'a pas accès aux données`, async () => {
        await GarantiesFinancières.create({
          id: GfId,
          projetId,
          statut: 'en attente',
          soumisesALaCandidature: false,
          dateLimiteEnvoi: null,
          envoyéesPar: new UniqueEntityID().toString(),
          dateConstitution: null,
          dateEchéance: null,
          validéesPar: null,
          type: null,
        });

        const résultat = await getGarantiesFinancièresDataForProjectPage({
          projetId,
          user: { role } as User,
        });

        expect(résultat).toBe(undefined);
      });
    }
  });

  describe(`Rôles utilisateurs ayant les droits sur les garanties financières`, () => {
    const utilisateurAutorisé = { role: 'admin' } as User;
    describe(`Retourner les données de GF en retard`, () => {
      it(`Etant donné un projet soumis à garanties financières
          Et dont les GF sont en attente avec une date limite d'envoi dépassée
          Alors un GarantiesFinancièresDTO devrait être retourné avec un statut 'en retard'`, async () => {
        const dateLimiteDépassée = new Date('2021-01-01');
        await GarantiesFinancières.create({
          id: GfId,
          projetId,
          statut: 'en attente',
          soumisesALaCandidature: false,
          dateLimiteEnvoi: dateLimiteDépassée,
          envoyéesPar: null,
          dateConstitution: null,
          dateEchéance: null,
          validéesPar: null,
          type: null,
        });

        const résultat = await getGarantiesFinancièresDataForProjectPage({
          projetId,
          user: utilisateurAutorisé,
        });

        expect(résultat).toEqual({
          statut: 'en retard',
          dateLimiteEnvoi: dateLimiteDépassée.getTime(),
        });
      });
    });

    describe(`Retourner les données de GF en attente`, () => {
      // role porteur
      it(`Etant donné un projet soumis à garanties financières
          Et dont les GF non soumises à la candidature sont 'en attente'
          Si le l'utilisateur a le rôle 'porteur-projet'
          Alors un GarantiesFinancièresDTO devrait être retourné avec :
            - un statut 'en attente'`, async () => {
        const user = { role: 'porteur-projet' } as User;
        await GarantiesFinancières.create({
          id: GfId,
          projetId,
          statut: 'en attente',
          soumisesALaCandidature: false,
          dateLimiteEnvoi,
          envoyéesPar: null,
          dateConstitution: null,
          dateEchéance: null,
          validéesPar: null,
          type: null,
        });

        const résultat = await getGarantiesFinancièresDataForProjectPage({
          projetId,
          user,
        });

        expect(résultat).toEqual({
          statut: 'en attente',
          dateLimiteEnvoi: dateLimiteEnvoi.getTime(),
        });
      });

      it(`Etant donné un projet soumis à garanties financières
            Et dont les GF soumises à la candidature sont 'en attente'
            Si l'utilisateur a le rôle 'porteur-projet'
            Alors un GarantiesFinancièresDTO devrait être retourné :
            - avec un statut 'en attente'`, async () => {
        const user = { role: 'porteur-projet' } as User;

        await GarantiesFinancières.create({
          id: GfId,
          projetId,
          statut: 'en attente',
          soumisesALaCandidature: true,
          dateLimiteEnvoi: null,
          envoyéesPar: null,
          dateConstitution: null,
          dateEchéance: null,
          validéesPar: null,
          type: 'Consignation',
        });

        const résultat = await getGarantiesFinancièresDataForProjectPage({
          projetId,
          user,
        });

        expect(résultat).toEqual({
          statut: 'en attente',
          typeGarantiesFinancières: 'Consignation',
        });
      });

      // autres rôles
      for (const role of USER_ROLES.filter((role) =>
        ['admin', 'dreal', 'dgec-validateur', 'caisse-des-dépôts', 'cre'].includes(role),
      )) {
        const user = { role } as User;

        it(`Etant donné un projet soumis à garanties financières
            Et dont les GF non soumises à la candidature sont en attente
            Si le l'utilisateur a le rôle ${role}
            Alors un GarantiesFinancièresDTO devrait être retourné avec :
            - un statut 'en attente'`, async () => {
          await GarantiesFinancières.create({
            id: GfId,
            projetId,
            statut: 'en attente',
            soumisesALaCandidature: false,
            dateLimiteEnvoi,
            envoyéesPar: null,
            dateConstitution: null,
            dateEchéance: null,
            validéesPar: null,
          });

          const résultat = await getGarantiesFinancièresDataForProjectPage({
            projetId,
            user,
          });

          expect(résultat).toEqual({
            statut: 'en attente',
            dateLimiteEnvoi: dateLimiteEnvoi.getTime(),
          });
        });

        it(`Etant donné un projet soumis à garanties financières
            Et dont les GF non soumises à la candidature sont en attente
            Si l'utilisateur a le rôle ${role}
            Alors un GarantiesFinancièresDTO devrait être retourné avec :
            - un statut 'en attente'`, async () => {
          await GarantiesFinancières.create({
            id: GfId,
            projetId,
            statut: 'en attente',
            soumisesALaCandidature: true,
            dateLimiteEnvoi: null,
            envoyéesPar: null,
            dateConstitution: null,
            dateEchéance: null,
            validéesPar: null,
            type: "Garantie financière avec date d'échéance et à renouveler",
          });

          const résultat = await getGarantiesFinancièresDataForProjectPage({
            projetId,
            user,
          });

          expect(résultat).toEqual({
            statut: 'en attente',
            typeGarantiesFinancières: "Garantie financière avec date d'échéance et à renouveler",
          });
        });
      }
    });

    describe(`Retourner les données de GF à traiter`, () => {
      for (const role of USER_ROLES.filter((role) =>
        ['porteur-projet', 'caisse-des-dépôts'].includes(role),
      )) {
        it(`Etant donné un projet soumis à garanties financières
              Et dont les GF ne sont 'à traiter'
              Si l'utilisateur est ${role}
              Alors un GarantiesFinancièresDTO devrait être retourné avec :
                - un statut 'à traiter'
                - et les données des GF soumises`, async () => {
          const user = { role } as User;

          await GarantiesFinancières.create({
            statut: 'à traiter',
            soumisesALaCandidature: false,
            dateLimiteEnvoi,
            envoyéesPar,
            dateConstitution,
            dateEchéance,
            validéesPar: null,
            fichierId,
            type: null,
            id: GfId,
            projetId,
          });

          await UserModel.create({
            id: envoyéesPar,
            email: 'porteur@test.test',
            fullName: 'le porteur',
            role: 'porteur-projet',
          });

          await File.create({
            id: fichierId,
            filename: 'fichier',
            designation: 'gf',
            createdAt: new Date(),
          });

          const résultat = await getGarantiesFinancièresDataForProjectPage({
            projetId,
            user,
          });

          expect(résultat).toEqual({
            statut: 'à traiter',
            dateConstitution: dateConstitution.getTime(),
            url: expect.anything(),
            envoyéesPar: 'porteur-projet',
            dateEchéance: dateEchéance.getTime(),
          });
        });
      }

      for (const role of USER_ROLES.filter((role) =>
        ['admin', 'dreal', 'cre', 'dgec-validateur'].includes(role),
      )) {
        it(`Etant donné un projet soumis à garanties financières
              Et dont les GF ne sont 'à traiter'
              Si l'utilisateur est ${role}
              Alors un GarantiesFinancièresDTO devrait être retourné avec :
                - un statut 'à traiter'
                - et les données des GF soumises`, async () => {
          const user = { role } as User;
          await GarantiesFinancières.create({
            statut: 'à traiter',
            soumisesALaCandidature: false,
            dateLimiteEnvoi,
            envoyéesPar,
            dateConstitution,
            dateEchéance,
            validéesPar: null,
            fichierId,
            type: null,
            id: GfId,
            projetId,
          });

          await UserModel.create({
            id: envoyéesPar,
            email: 'porteur@test.test',
            fullName: 'le porteur',
            role: 'porteur-projet',
          });

          await File.create({
            id: fichierId,
            filename: 'fichier',
            designation: 'gf',
            createdAt: new Date(),
          });

          const résultat = await getGarantiesFinancièresDataForProjectPage({
            projetId,
            user,
          });

          expect(résultat).toEqual({
            statut: 'à traiter',
            dateConstitution: dateConstitution.getTime(),
            url: expect.anything(),
            envoyéesPar: 'porteur-projet',
            dateEchéance: dateEchéance.getTime(),
          });
        });
      }
    });

    describe(`Retourner les données de GF validées`, () => {
      for (const role of USER_ROLES.filter((role) =>
        ['admin', 'dreal', 'dgec-validateur', 'cre', 'caisse-des-dépôts'].includes(role),
      )) {
        it(`Etant donné un projet soumis à garanties financières
            Et dont les GF sont validées
            Si l'utilisateur est ${role}
            Alors un GarantiesFinancièresDTO devrait être retourné avec un statut 'validé'`, async () => {
          const user = { role } as User;
          await GarantiesFinancières.create({
            statut: 'validé',
            soumisesALaCandidature: false,
            dateLimiteEnvoi,
            envoyéesPar,
            dateConstitution,
            dateEchéance,
            validéesPar: null,
            fichierId,
            type: null,
            id: GfId,
            projetId,
          });

          await UserModel.create({
            id: envoyéesPar,
            email: 'admin@test.test',
            fullName: 'nom admin',
            role: 'admin',
          });

          await File.create({
            id: fichierId,
            filename: 'fichier',
            designation: 'gf',
            createdAt: new Date(),
          });

          const résultat = await getGarantiesFinancièresDataForProjectPage({
            projetId,
            user,
          });

          expect(résultat).toEqual({
            statut: 'validé',
            dateConstitution: dateConstitution.getTime(),
            url: expect.anything(),
            envoyéesPar: 'admin',
            dateEchéance: dateEchéance.getTime(),
          });
        });
      }

      it(`Etant donné un projet soumis à garanties financières
            Et dont les GF sont validées
            Si l'utilisateur est porteur de projet
            Alors un GarantiesFinancièresDTO devrait être retourné avec un statut 'validé'`, async () => {
        const user = { role: 'porteur-projet' } as User;

        await GarantiesFinancières.create({
          statut: 'validé',
          soumisesALaCandidature: false,
          dateLimiteEnvoi,
          envoyéesPar,
          dateConstitution,
          dateEchéance,
          validéesPar: null,
          fichierId,
          type: null,
          id: GfId,
          projetId,
        });

        await UserModel.create({
          id: envoyéesPar,
          email: 'admin@test.test',
          fullName: 'nom admin',
          role: 'admin',
        });

        await File.create({
          id: fichierId,
          filename: 'fichier',
          designation: 'gf',
          createdAt: new Date(),
        });

        const résultat = await getGarantiesFinancièresDataForProjectPage({
          projetId,
          user,
        });

        expect(résultat).toEqual({
          statut: 'validé',
          dateConstitution: dateConstitution.getTime(),
          url: expect.anything(),
          envoyéesPar: 'admin',
          dateEchéance: dateEchéance.getTime(),
        });
      });
    });
  });
});
