import { okAsync } from '@core/utils';
import { makeUser } from '@entities';
import { StatutRéponseIncompatibleAvecAnnulationError } from '@modules/demandeModification/errors';
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared';
import { USER_ROLES } from '@modules/users';
import { UnwrapForTest } from '../../../../types';
import {
  fakeTransactionalRepo,
  makeFakeDemandeAbandon,
} from '../../../../__tests__/fixtures/aggregates';
import makeFakeUser from '../../../../__tests__/fixtures/user';
import { makeAnnulerRejetAbandon } from './annulerRejetAbandon';

describe(`Pouvoir annuler le rejet d'un abandon`, () => {
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null));
  beforeEach(() => publishToEventStore.mockClear());

  describe(`Annulation impossible si l'utilisateur n'a pas le rôle 'admin' ou 'dgec-validateur'`, () => {
    const rôlesNePouvantPasAnnulerLeRejetDeLAbandon = USER_ROLES.filter(
      (role) => !['admin', 'dgec-validateur'].includes(role),
    );
    for (const role of rôlesNePouvantPasAnnulerLeRejetDeLAbandon) {
      it(`Etant donné un utilisateur ayant le rôle ${role}
          Lorsqu'il annule le rejet d'une demande d'abandon'
          Alors une erreur UnauthorizedError devrait être retournée`, async () => {
        const user = UnwrapForTest(makeUser(makeFakeUser({ role })));
        const demandeAbandonRepo = fakeTransactionalRepo(
          makeFakeDemandeAbandon({ projetId: 'id-du-projet' }),
        );

        const annulerRéponseDemandéAbandon = makeAnnulerRejetAbandon({
          demandeAbandonRepo,
          publishToEventStore,
        });

        const res = await annulerRéponseDemandéAbandon({
          user,
          demandeAbandonId: 'id-de-la-demande',
        });

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError);
        expect(publishToEventStore).not.toHaveBeenCalled();
      });
    }
  });

  describe(`Annulation impossible si le statut de la demande n'est pas "refusée"`, () => {
    it(`Etant donné un utilisateur admin ayant les droits sur le projet
        Et une demande d'abandon en statut 'envoyée'
        Lorsque l'utilisateur exécute la commande
        Alors une erreur StatutRéponseIncompatibleAvecAnnulationError devrait être retournée`, async () => {
      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })));

      const demandeAbandonRepo = fakeTransactionalRepo(
        makeFakeDemandeAbandon({ projetId: 'id-du-projet', statut: 'envoyée' }),
      );

      const annulerRéponseDemandéAbandon = makeAnnulerRejetAbandon({
        demandeAbandonRepo,
        publishToEventStore,
      });

      const res = await annulerRéponseDemandéAbandon({
        user,
        demandeAbandonId: 'id-de-la-demande',
      });

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(StatutRéponseIncompatibleAvecAnnulationError);
      expect(publishToEventStore).not.toHaveBeenCalled();
    });
  });
  describe(`Annulation du rejet de l'abandon possible`, () => {
    it(`Etant donné un utilisateur admin ayant les droits sur le projet
        Et une demande d'abandon en statut "refusée"
        Lorsque l'utilisateur annule le rejet de l'abandon
        Alors un événement RejetAbandonAnnulé devrait être émis`, async () => {
      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin', id: 'user-id' })));

      const demandeAbandonRepo = fakeTransactionalRepo(
        makeFakeDemandeAbandon({ projetId: 'id-du-projet', statut: 'refusée', id: 'id-demande' }),
      );

      const annulerRejetAbandon = makeAnnulerRejetAbandon({
        demandeAbandonRepo,
        publishToEventStore,
      });

      await annulerRejetAbandon({
        user,
        demandeAbandonId: 'id-demande',
      });

      expect(publishToEventStore).toBeCalledTimes(1);
      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'RejetAbandonAnnulé',
          payload: expect.objectContaining({
            demandeAbandonId: 'id-demande',
            annuléPar: 'user-id',
            projetId: 'id-du-projet',
          }),
        }),
      );
    });
  });
});
