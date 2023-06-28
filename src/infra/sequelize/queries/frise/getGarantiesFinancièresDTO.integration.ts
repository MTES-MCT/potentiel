import { getGarantiesFinancièresDTO } from './getGarantiesFinancièresDTO';
import { resetDatabase } from '@infra/sequelize/helpers';
import { UniqueEntityID } from '@core/domain';
import { User } from '@entities';
import { USER_ROLES } from '@modules/users';

describe(`Requête getGarantiesFinancièresDTO`, () => {
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
        const garantiesFinancières = {
          statut: 'en attente',
          soumisesALaCandidature: false,
          dateLimiteEnvoi: null,
          envoyéesPar: new UniqueEntityID().toString(),
          dateConstitution: null,
          dateEchéance: null,
          validéesPar: null,
          type: null,
        } as const;

        const résultat = await getGarantiesFinancièresDTO({
          garantiesFinancières,
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
        const garantiesFinancières = {
          statut: 'en attente',
          soumisesALaCandidature: false,
          dateLimiteEnvoi: dateLimiteDépassée,
          envoyéesPar: new UniqueEntityID().toString(),
          dateConstitution: null,
          dateEchéance: null,
          validéesPar: null,
          type: null,
        } as const;

        const résultat = await getGarantiesFinancièresDTO({
          garantiesFinancières,
          user: utilisateurAutorisé,
        });

        expect(résultat).toEqual({
          type: 'garanties-financières',
          statut: 'en retard',
          date: dateLimiteDépassée.getTime(),
          variant: 'admin',
        });
      });
    });

    describe(`Retourner les données de GF en attente`, () => {
      it(`Etant donné un projet soumis à garanties financières
          Et dont les GF sont en attente
          Alors un GarantiesFinancièresDTO devrait être retourné avec la statut 'en attente'`, async () => {
        const garantiesFinancières = {
          statut: 'en attente',
          soumisesALaCandidature: false,
          dateLimiteEnvoi,
          envoyéesPar: new UniqueEntityID().toString(),
          dateConstitution: null,
          dateEchéance: null,
          validéesPar: null,
          type: null,
        } as const;

        const résultat = await getGarantiesFinancièresDTO({
          garantiesFinancières,
          user: utilisateurAutorisé,
        });

        expect(résultat).toEqual({
          type: 'garanties-financières',
          statut: 'en attente',
          date: dateLimiteEnvoi.getTime(),
          variant: 'admin',
        });
      });

      it(`Etant donné un projet soumis à garanties financières,
  et dont les GF sont en attente,
  et pour lesquelles le type de la date d'échéance sont connus,
  alors la requête getGFItemProps devrait retourner un GarantiesFinancièresDTO 
  avec un statut 'en attente'`, async () => {
        const dateEchéance = new Date('2025-01-01');
        const garantiesFinancières = {
          statut: 'en attente',
          soumisesALaCandidature: false,
          dateLimiteEnvoi,
          envoyéesPar: new UniqueEntityID().toString(),
          dateConstitution: null,
          validéesPar: null,
          type: "Garantie financière avec date d'échéance et à renouveler",
          dateEchéance,
        } as const;

        const résultat = await getGarantiesFinancièresDTO({
          garantiesFinancières,
          user: utilisateurAutorisé,
        });

        expect(résultat).toEqual({
          type: 'garanties-financières',
          statut: 'en attente',
          date: dateLimiteEnvoi.getTime(),
          variant: 'admin',
          typeGarantiesFinancières: "Garantie financière avec date d'échéance et à renouveler",
          dateEchéance: dateEchéance.getTime(),
        });
      });
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
              - retrait de dépôt possible
              - et les données des GF soumises`, async () => {
          const user = { role } as User;
          const garantiesFinancières = {
            statut: 'à traiter',
            soumisesALaCandidature: false,
            dateLimiteEnvoi,
            envoyéesPar,
            dateConstitution,
            dateEchéance,
            validéesPar: null,
            fichier: { id: fichierId, filename: 'nom-fichier' },
            envoyéesParRef: { role: 'porteur-projet' as 'porteur-projet' },
            type: null,
          } as const;

          const résultat = await getGarantiesFinancièresDTO({
            garantiesFinancières,
            user,
          });

          expect(résultat).toEqual({
            type: 'garanties-financières',
            statut: 'à traiter',
            date: dateConstitution.getTime(),
            variant: role,
            url: expect.anything(),
            envoyéesPar: 'porteur-projet',
            dateEchéance: dateEchéance.getTime(),
            retraitDépôtPossible: true,
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
              - SANS retrait de dépôt possible
              - et les données des GF soumises`, async () => {
          const user = { role } as User;
          const garantiesFinancières = {
            statut: 'à traiter',
            soumisesALaCandidature: false,
            dateLimiteEnvoi,
            envoyéesPar,
            dateConstitution,
            dateEchéance,
            validéesPar: null,
            fichier: { id: fichierId, filename: 'nom-fichier' },
            envoyéesParRef: { role: 'porteur-projet' as 'porteur-projet' },
            type: null,
          } as const;

          const résultat = await getGarantiesFinancièresDTO({
            garantiesFinancières,
            user,
          });

          expect(résultat).toEqual({
            type: 'garanties-financières',
            statut: 'à traiter',
            date: dateConstitution.getTime(),
            variant: role,
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
          Alors un GarantiesFinancièresDTO devrait être retourné avec un statut 'validé' et retraitDépôtPossible à "true"`, async () => {
          const user = { role } as User;
          const garantiesFinancières = {
            statut: 'validé',
            soumisesALaCandidature: false,
            dateLimiteEnvoi,
            envoyéesPar,
            dateConstitution,
            dateEchéance,
            validéesPar: null,
            fichier: { id: fichierId, filename: 'nom-fichier' },
            envoyéesParRef: { role: 'admin' as 'admin' },
            type: null,
          } as const;

          const résultat = await getGarantiesFinancièresDTO({
            garantiesFinancières,
            user,
          });

          expect(résultat).toEqual({
            type: 'garanties-financières',
            statut: 'validé',
            date: dateConstitution.getTime(),
            variant: role,
            url: expect.anything(),
            envoyéesPar: 'admin',
            dateEchéance: dateEchéance.getTime(),
            retraitDépôtPossible: true,
          });
        });
      }

      it(`Etant donné un projet soumis à garanties financières
          Et dont les GF sont validées
          Si l'utilisateur est porteur de projet
          Alors un GarantiesFinancièresDTO devrait être retourné avec un statut 'validé' sans 'retraitDépôtPossible'`, async () => {
        const user = { role: 'porteur-projet' } as User;
        const garantiesFinancières = {
          statut: 'validé',
          soumisesALaCandidature: false,
          dateLimiteEnvoi,
          envoyéesPar,
          dateConstitution,
          dateEchéance,
          validéesPar: null,
          fichier: { id: fichierId, filename: 'nom-fichier' },
          envoyéesParRef: { role: 'admin' as 'admin' },
          type: null,
        } as const;

        const résultat = await getGarantiesFinancièresDTO({
          garantiesFinancières,
          user,
        });

        expect(résultat).toEqual({
          type: 'garanties-financières',
          statut: 'validé',
          date: dateConstitution.getTime(),
          variant: 'porteur-projet',
          url: expect.anything(),
          envoyéesPar: 'admin',
          dateEchéance: dateEchéance.getTime(),
        });
      });
    });
  });
});
