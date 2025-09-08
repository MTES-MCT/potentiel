import { registerLauréatQueries, registerLauréatUseCases } from '@potentiel-domain/laureat';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';
import { findProjection, listProjection } from '@potentiel-infrastructure/pg-projection-read';
import { récupérerIdentifiantsProjetParEmailPorteurAdapter } from '@potentiel-infrastructure/domain-adapters';
import { SendEmail } from '@potentiel-applications/notifications';

type SetupLauréatDependencies = {
  sendEmail: SendEmail;
};

export const setupLauréat = async (_: SetupLauréatDependencies) => {
  registerLauréatUseCases({
    loadAggregate,
  });

  registerLauréatQueries({
    find: findProjection,
    list: listProjection,
    récupérerIdentifiantsProjetParEmailPorteur: récupérerIdentifiantsProjetParEmailPorteurAdapter,
  });

  return async () => {};
};
