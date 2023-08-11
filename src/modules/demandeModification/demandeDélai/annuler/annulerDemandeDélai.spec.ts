import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { okAsync } from '@core/utils';
import { DomainEvent } from '@core/domain';
import { InfraNotAvailableError, UnauthorizedError } from '@modules/shared';
import {
  fakeTransactionalRepo,
  makeFakeDemandeDélai,
} from '../../../../__tests__/fixtures/aggregates';
import { makeAnnulerDemandeDélai } from './annulerDemandeDélai';
import { StatutDemandeDélai, statutsDemandeDélai } from '../DemandeDélai';
import { StatusPreventsCancellingError } from '@modules/modificationRequest';
import { User } from '../../../../entities';

describe(`Commande annuler demande délai`, () => {
  const publishToEventStore = jest.fn((event: DomainEvent) =>
    okAsync<null, InfraNotAvailableError>(null),
  );
  const user = { role: 'porteur-projet', id: 'fake-id' } as User;

  beforeEach(() => {
    publishToEventStore.mockClear();
  });

  const shouldUserAccessProject = jest.fn(async () => true);

  describe(`Annulation impossible si le porteur n'a pas les droits sur le projet`, () => {
    const shouldUserAccessProject = jest.fn(async () => false);
    it(`Etant donné un porteur n'ayant pas les droits sur le projet, 
      lorsqu'il annule une demande de délai,
      alors il devrait être informé qu'il n'a pas les droits pour cette action.`, async () => {
      const demandeDélaiRepo = fakeTransactionalRepo(
        makeFakeDemandeDélai({ projetId: 'le-projet-de-la-demande' }),
      );

      const annulerDemandéDélai = makeAnnulerDemandeDélai({
        shouldUserAccessProject,
        demandeDélaiRepo,
        publishToEventStore,
      });

      const res = await annulerDemandéDélai({
        user,
        demandeDélaiId: 'la-demande-a-annuler',
      });

      expect(res._unsafeUnwrapErr()).toBeInstanceOf(UnauthorizedError);
      expect(publishToEventStore).not.toHaveBeenCalled();
    });
  });

  describe(`Cas d'un statut de demande incompatible avec une annulation`, () => {
    const statutsIncompatiblesAvecAnnulation = statutsDemandeDélai.filter(
      (statut) => !['envoyée', 'en instruction'].includes(statut),
    );

    for (const statut of statutsIncompatiblesAvecAnnulation) {
      it(`Etant donné un porteur ayant les droits sur le projet, 
          lorsque le porteur annule une demande de délai en statut ${statut},
          alors une erreur StatusPreventsCancellingError devrait être émise`, async () => {
        const demandeDélaiId = 'la-demande-a-annuler';

        const demandeDélaiRepo = fakeTransactionalRepo(
          makeFakeDemandeDélai({
            id: demandeDélaiId,
            statut,
            projetId: 'le-projet-de-la-demande',
          }),
        );

        const annulerDemandéDélai = makeAnnulerDemandeDélai({
          shouldUserAccessProject,
          demandeDélaiRepo,
          publishToEventStore,
        });

        const res = await annulerDemandéDélai({
          user,
          demandeDélaiId,
        });

        expect(res._unsafeUnwrapErr()).toBeInstanceOf(StatusPreventsCancellingError);
        expect(publishToEventStore).not.toHaveBeenCalled();
      });
    }
  });

  describe(`Cas d'une annulation d'abandon possible`, () => {
    const statutsCompatiblesAvecAnnulation = ['envoyée', 'en instruction'] as StatutDemandeDélai[];
    for (const statut of statutsCompatiblesAvecAnnulation) {
      it(`Etant donné un porteur ayant les droits sur le projet,
      lorsqu'il annule une demande de délai en statut ${statut},
      alors la demande devrait être annulée`, async () => {
        const demandeDélaiId = 'la-demande-a-annuler';

        const demandeDélaiRepo = fakeTransactionalRepo(
          makeFakeDemandeDélai({ id: demandeDélaiId, statut, projetId: 'identifiant-projet' }),
        );

        const annulerDemandéDélai = makeAnnulerDemandeDélai({
          shouldUserAccessProject,
          demandeDélaiRepo,
          publishToEventStore,
        });

        await annulerDemandéDélai({ user, demandeDélaiId });

        expect(publishToEventStore).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'DélaiAnnulé',
            payload: expect.objectContaining({
              demandeDélaiId,
              annuléPar: user.id,
              projetId: 'identifiant-projet',
            }),
          }),
        );
      });
    }
  });
});
