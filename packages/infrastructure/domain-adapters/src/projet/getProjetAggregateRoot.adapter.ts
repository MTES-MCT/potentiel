import { GetProjetAggregateRoot, ProjetAggregateRoot } from '@potentiel-domain/projet';
import { loadAggregateV2 } from '@potentiel-infrastructure/pg-event-sourcing';

import { loadAppelOffreAggregateAdapter } from '../appel-offre/loadAppelOffreAggregate.adapter';

export const getProjetAggregateRootAdapter: GetProjetAggregateRoot = async (identifiant) => {
  const projet = await ProjetAggregateRoot.get(identifiant, {
    loadAggregate: loadAggregateV2,
    loadAppelOffreAggregate: loadAppelOffreAggregateAdapter,
  });
  return projet;
};
