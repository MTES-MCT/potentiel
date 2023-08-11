import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { okAsync } from '@core/utils';
import { User } from '@entities';
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared';
import { fakeTransactionalRepo } from '../../../../__tests__/fixtures/aggregates';
import { makeAnnulerDemandeAnnulationAbandon } from './annulerDemandeAnnulationAbandon';
import { DemandeAnnulationAbandon } from '../DemandeAnnulationAbandon';
import { StatutRéponseIncompatibleAvecAnnulationError } from '../../errors/StatutRéponseIncompatibleAvecAnnulationError';

describe(`Annuler une demande d'annulation d'abandon`, () => {
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null));
  const user = { role: 'porteur-projet' } as User;

  beforeEach(() => {
    publishToEventStore.mockClear();
  });

  describe(`Impossible si le porteur n'a pas les droits sur le projet`, () => {
    it(`Etant donné un porteur n'ayant pas les droits sur le projet
        Lorsqu'il annule une demande d'annulation d'abandon,
        Alors le porteur devrait être averti qu'il n'a pas les droits pour annuler la demande`, async () => {
      const demandeAnnulationAbandonRepo = fakeTransactionalRepo({
        projetId: 'le-projet-de-la-demande',
      } as DemandeAnnulationAbandon);

      const annuler = makeAnnulerDemandeAnnulationAbandon({
        shouldUserAccessProject: jest.fn(async () => false),
        demandeAnnulationAbandonRepo,
        publishToEventStore,
      });

      const annulation = await annuler({ user, demandeId: 'la-demande-a-annuler' });

      expect(annulation._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError);
      expect(publishToEventStore).not.toHaveBeenCalled();
    });
  });

  describe(`Impossible si le statut de la demande n'est pas envoyée `, () => {
    for (const statut of ['annulée', 'accordée', 'refusée']) {
      it(`Etant donné un porteur ayant les droits sur le projet
          Lorsqu'il annule une demande d'annulation d'abandon ${statut},
          Alors le porteur devrait être averti qu'il n'est pas possible d'annuler une demande ${statut}`, async () => {
        const demandeAnnulationAbandonRepo = fakeTransactionalRepo({
          projetId: 'le-projet-de-la-demande',
          statut,
        } as DemandeAnnulationAbandon);

        const annuler = makeAnnulerDemandeAnnulationAbandon({
          shouldUserAccessProject: jest.fn(async () => true),
          demandeAnnulationAbandonRepo,
          publishToEventStore,
        });

        const annulation = await annuler({ user, demandeId: 'la-demande-a-annuler' });

        expect(annulation._unsafeUnwrapErr()).toBeInstanceOf(
          StatutRéponseIncompatibleAvecAnnulationError,
        );
        expect(publishToEventStore).not.toHaveBeenCalled();
      });
    }
  });

  describe(`Annuler la demande`, () => {
    it(`Etant donné un porteur ayant les droits sur le projet
        Lorsqu'il annule une demande d'annulation d'abandon,
        Alors la demande devrait être annulée`, async () => {
      const demandeAnnulationAbandonRepo = fakeTransactionalRepo({
        projetId: 'le-projet-de-la-demande',
        statut: 'envoyée',
      } as DemandeAnnulationAbandon);

      const annuler = makeAnnulerDemandeAnnulationAbandon({
        shouldUserAccessProject: jest.fn(async () => true),
        demandeAnnulationAbandonRepo,
        publishToEventStore,
      });

      await annuler({ user, demandeId: 'la-demande-a-annuler' });

      expect(publishToEventStore).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'AnnulationAbandonAnnulée',
          payload: {
            demandeId: 'la-demande-a-annuler',
            annuléePar: user.id,
          },
        }),
      );
    });
  });
});
