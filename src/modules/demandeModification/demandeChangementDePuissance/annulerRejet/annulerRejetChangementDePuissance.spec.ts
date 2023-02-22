import { DomainEvent } from '@core/domain';
import { okAsync } from '@core/utils';
import { makeUser } from '@entities';
import { StatutRéponseIncompatibleAvecAnnulationError } from '@modules/demandeModification/errors';
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared';
import { ModificationRequest } from '@modules/modificationRequest';
import { UnwrapForTest } from '../../../../types';
import {
  fakeTransactionalRepo,
  makeFakeDemandeChangementDePuissance,
} from '../../../../__tests__/fixtures/aggregates';
import makeFakeUser from '../../../../__tests__/fixtures/user';
import { makeAnnulerRejetChangementDePuissance } from './annulerRejetChangementDePuissance';
import { USER_ROLES } from '@modules/users';

describe(`Commande annulerRejetChangementDePuissance`, () => {
  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null),
  );
  const shouldUserAccessProject = jest.fn(async () => true);
  beforeEach(() => {
    publishToEventStore.mockClear();
  });

  describe(`Annulation impossible si l'utilisateur n'a pas le rôle 'admin', 'dgec-validateur' ou 'dreal'`, () => {
    const rolesNePouvantPasAnnulerUnRejetDeRecours = USER_ROLES.filter(
      (role) => !['admin', 'dgec-validateur', 'dreal'].includes(role),
    );

    for (const role of rolesNePouvantPasAnnulerUnRejetDeRecours) {
      describe(`Etant donné un utilisateur ayant le rôle ${role}`, () => {
        const user = UnwrapForTest(makeUser(makeFakeUser({ role })));
        const modificationRequestRepo = fakeTransactionalRepo(
          makeFakeDemandeChangementDePuissance() as ModificationRequest,
        );

        it(`Lorsqu'il annule le rejet d'une demande de changement de puissance,
          Alors une erreur UnauthorizedError devrait être retournée`, async () => {
          const annulerRejetChangementDePuissance = makeAnnulerRejetChangementDePuissance({
            shouldUserAccessProject,
            modificationRequestRepo,
            publishToEventStore,
          });

          const res = await annulerRejetChangementDePuissance({
            user,
            demandeChangementDePuissanceId: 'id-de-la-demande',
          });

          expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError);
          expect(publishToEventStore).not.toHaveBeenCalled();
        });
      });
    }
  });

  describe(`Annulation impossible si l'utilisateur n'a pas les droits sur le projet`, () => {
    describe(`Etant donné un utilisateur dreal n'ayant pas les droits sur le projet`, () => {
      const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'dreal' })));
      const shouldUserAccessProject = jest.fn(async () => false);
      it(`Lorsqu'il annule le rejet d'une demande de délai,
        Alors une erreur UnauthorizedError devrait être retournée`, async () => {
        const modificationRequestRepo = fakeTransactionalRepo(
          makeFakeDemandeChangementDePuissance({ status: 'rejetée' }) as ModificationRequest,
        );

        const annulerRejetChangementDePuissance = makeAnnulerRejetChangementDePuissance({
          shouldUserAccessProject,
          modificationRequestRepo,
          publishToEventStore,
        });

        const res = await annulerRejetChangementDePuissance({
          user,
          demandeChangementDePuissanceId: 'id-de-la-demande',
        });

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError);
        expect(publishToEventStore).not.toHaveBeenCalled();
      });
    });
  });

  describe(`Annulation impossible si le statut de la demande n'est pas "refusée"`, () => {
    describe(`Etant donné un utilisateur admin ayant les droits sur le projet
      et une demande de changement de puissance en statut 'envoyée'`, () => {
      it(`Lorsque l'utilisateur exécute la commande,
      alors une erreur StatutRéponseIncompatibleAvecAnnulationError devrait être retournée`, async () => {
        const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin' })));
        const modificationRequestRepo = fakeTransactionalRepo(
          makeFakeDemandeChangementDePuissance({ status: 'envoyée' }) as ModificationRequest,
        );
        const annulerRejetChangementDePuissance = makeAnnulerRejetChangementDePuissance({
          shouldUserAccessProject,
          modificationRequestRepo,
          publishToEventStore,
        });

        const res = await annulerRejetChangementDePuissance({
          user,
          demandeChangementDePuissanceId: 'id-de-la-demande',
        });

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(StatutRéponseIncompatibleAvecAnnulationError);
        expect(publishToEventStore).not.toHaveBeenCalled();
      });
    });
  });

  describe(`Annuler le rejet d'une demande de changement de puissance`, () => {
    describe(`Annulation de la demande possible`, () => {
      describe(`Etant donné un utilisateur admin, dgec-validateur ou dreal ayant les droits sur le projet
      et une demande de délai en statut "refusée"`, () => {
        it(`Lorsque l'utilisateur annule le rejet de la demande de délai,
        alors un événement RejetRecoursAnnulé devrait être émis`, async () => {
          const user = UnwrapForTest(makeUser(makeFakeUser({ role: 'admin', id: 'user-id' })));
          const projectId = 'id-du-projet';
          const demandeChangementDePuissanceId = 'id-de-la-demande';
          const modificationRequestRepo = fakeTransactionalRepo(
            makeFakeDemandeChangementDePuissance({
              status: 'rejetée',
              projectId,
            }) as ModificationRequest,
          );
          const annulerRejetChangementDePuissance = makeAnnulerRejetChangementDePuissance({
            shouldUserAccessProject,
            modificationRequestRepo,
            publishToEventStore,
          });

          await annulerRejetChangementDePuissance({
            user,
            demandeChangementDePuissanceId,
          });

          expect(publishToEventStore).toHaveBeenCalledWith(
            expect.objectContaining({
              type: 'RejetChangementDePuissanceAnnulé',
              payload: expect.objectContaining({
                demandeChangementDePuissanceId,
                annuléPar: 'user-id',
                projetId: projectId,
              }),
            }),
          );
        });
      });
    });
  });
});
