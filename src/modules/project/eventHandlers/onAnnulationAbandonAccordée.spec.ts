import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { UniqueEntityID } from '../../../core/domain';
import { AnnulationAbandonAccordée } from '../../demandeModification';
import { InfraNotAvailableError } from '../../shared';
import { okAsync } from 'neverthrow';
import { fakeTransactionalRepo } from '../../../__tests__/fixtures/aggregates';
import makeFakeProject from '../../../__tests__/fixtures/project';
import { makeOnAnnulationAbandonAccordée } from './onAnnulationAbandonAccordée';

describe(`Handler de projet onAnnulationAbandonAccordée`, () => {
  const publishToEventStore = jest.fn(() => okAsync<null, InfraNotAvailableError>(null));

  beforeEach(() => {
    publishToEventStore.mockClear();
  });

  const projetId = new UniqueEntityID().toString();
  const completionDueOn = new Date().getTime();
  const dcrDueOn = new Date().getTime();
  const notifiedOn = new Date('2020-01-01').getTime();

  const événemement = new AnnulationAbandonAccordée({
    payload: {
      demandeId: new UniqueEntityID().toString(),
      projetId,
      accordéPar: new UniqueEntityID().toString(),
      fichierRéponseId: new UniqueEntityID().toString(),
    },
  });
  it(`Etant donné un projet
      Lorsqu'une demande d'annulation d'abandon est accordée
      Alors l'abandon du projet devrait être annulé`, async () => {
    const projectRepo = fakeTransactionalRepo(
      makeFakeProject({ id: projetId, completionDueOn, dcrDueOn, notifiedOn }),
    );
    const onAnnulationAbandonAccordée = makeOnAnnulationAbandonAccordée({
      projectRepo,
      publishToEventStore,
    });

    await onAnnulationAbandonAccordée(événemement);

    expect(publishToEventStore).toHaveBeenCalledTimes(1);

    expect(publishToEventStore).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'AbandonProjetAnnulé',
        payload: {
          projetId,
          dateAchèvement: new Date(completionDueOn),
          dateLimiteEnvoiDcr: dcrDueOn,
        },
      }),
    );
  });
});
