import { GetProjetAggregateRoot, ProjetAggregateRoot } from '@potentiel-domain/projet';
import { loadAggregate } from '@potentiel-infrastructure/pg-event-sourcing';

import { loadAppelOffreAggregateAdapter } from '../appel-offre/loadAppelOffreAggregate.adapter';

export const getProjetAggregateRootAdapter: GetProjetAggregateRoot = async (
  identifiant,
  skipInitialization,
) => {
  const projet = await ProjetAggregateRoot.get(
    identifiant,
    {
      loadAggregate,
      loadAppelOffreAggregate: loadAppelOffreAggregateAdapter,
    },
    skipInitialization,
  );
  return projet;
};
