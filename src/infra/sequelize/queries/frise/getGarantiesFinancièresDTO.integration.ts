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

  describe(`Ne rien retourner si l'utlisateur n'a pas les droits`, () => {
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
      it(`Etant donné un projet soumis à garanties financières,
  si l'utlisateur a le rôle ${role},
  alors il n'a pas accès aux données`, async () => {
        const garantiesFinancières = {
          statut: 'en attente',
          soumisesALaCandidature: false,
          dateLimiteEnvoi: null,
          envoyéesPar: new UniqueEntityID().toString(),
          dateConstitution: null,
          dateEchéance: null,
          validéesPar: null,
        } as const;

        const résultat = await getGarantiesFinancièresDTO({
          garantiesFinancières,
          user: { role } as User,
        });

        expect(résultat).toBe(undefined);
      });
    }
  });

  describe(`Si le rôle a le droit de visualiser les GF`, () => {
    const utilisateurAutorisé = { role: 'admin' } as User;
    describe(`Retourner les données de GF en retard`, () => {
      it(`Etant donné un projet soumis à garanties financières,
  et dont les GF sont en attente avec une date limite d'envoi dépassée,
  alors la requête devrait retourner un GarantiesFinancièresDTO 
  avec un statut 'en retard'`, async () => {
        const dateLimiteDépassée = new Date('2021-01-01');
        const garantiesFinancières = {
          statut: 'en attente',
          soumisesALaCandidature: false,
          dateLimiteEnvoi: dateLimiteDépassée,
          envoyéesPar: new UniqueEntityID().toString(),
          dateConstitution: null,
          dateEchéance: null,
          validéesPar: null,
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
      it(`Etant donné un projet soumis à garanties financières,
  et dont les GF sont en attente,
  alors la requête getGFItemProps devrait retourner un GarantiesFinancièresDTO 
  avec un statut 'en attente'`, async () => {
        const garantiesFinancières = {
          statut: 'en attente',
          soumisesALaCandidature: false,
          dateLimiteEnvoi,
          envoyéesPar: new UniqueEntityID().toString(),
          dateConstitution: null,
          dateEchéance: null,
          validéesPar: null,
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
    });

    describe(`Retourner les données de GF à traiter`, () => {
      it(`Etant donné un projet soumis à garanties financières,
  et dont les GF ne sont 'à traiter',
  alors la requête getGFItemProps devrait retourner un GarantiesFinancièresDTO 
  avec un statut 'à traiter' et les données des GF soumises`, async () => {
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
        } as const;

        const résultat = await getGarantiesFinancièresDTO({
          garantiesFinancières,
          user: utilisateurAutorisé,
        });

        expect(résultat).toEqual({
          type: 'garanties-financières',
          statut: 'à traiter',
          date: dateConstitution.getTime(),
          variant: 'admin',
          url: expect.anything(),
          envoyéesPar: 'porteur-projet',
          dateEchéance: dateEchéance.getTime(),
        });
      });
    });

    describe(`Retourner les données de GF validées`, () => {
      it(`Etant donné un projet soumis à garanties financières,
  et dont les GF sont validées par un utilisateur dans Potentiel,
  alors la requête getGFItemProps devrait retourner les données des GF 
  sous forme d'un GarantiesFinancièresDTO avec un statut 'validé'`, async () => {
        const garantiesFinancières = {
          statut: 'validé',
          soumisesALaCandidature: false,
          dateLimiteEnvoi,
          envoyéesPar,
          dateConstitution,
          dateEchéance,
          validéesPar: new UniqueEntityID().toString(),
          fichier: { id: fichierId, filename: 'nom-fichier' },
          envoyéesParRef: { role: 'admin' as 'admin' },
        } as const;

        const résultat = await getGarantiesFinancièresDTO({
          garantiesFinancières,
          user: utilisateurAutorisé,
        });

        expect(résultat).toEqual({
          type: 'garanties-financières',
          statut: 'validé',
          date: dateConstitution.getTime(),
          variant: 'admin',
          url: expect.anything(),
          envoyéesPar: 'admin',
          dateEchéance: dateEchéance.getTime(),
        });
      });
    });

    describe(`Retourner les données de GF validées et supprimables`, () => {
      it(`Etant donné un projet soumis à garanties financières,
  et dont les GF sont validées à la candidature et non dans Potentiel,
  alors la requête getGFItemProps devrait retourner un GarantiesFinancièresDTO 
  avec un statut 'validé'et retraitDépôtPossible à "true"`, async () => {
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
        } as const;

        const résultat = await getGarantiesFinancièresDTO({
          garantiesFinancières,
          user: utilisateurAutorisé,
        });

        expect(résultat).toEqual({
          type: 'garanties-financières',
          statut: 'validé',
          date: dateConstitution.getTime(),
          variant: 'admin',
          url: expect.anything(),
          envoyéesPar: 'admin',
          dateEchéance: dateEchéance.getTime(),
          retraitDépôtPossible: true,
        });
      });
    });
  });
});
