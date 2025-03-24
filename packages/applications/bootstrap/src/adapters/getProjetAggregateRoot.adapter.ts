import { GetProjetAggregateRoot, ProjetAggregateRoot } from '@potentiel-domain/projet';
import { loadAggregateV2 } from '@potentiel-infrastructure/pg-event-sourcing';

export const getProjetAggregateRootAdapter: GetProjetAggregateRoot = async (identifiant) => {
  const projet = await ProjetAggregateRoot.get(identifiant, {
    loadAggregate: loadAggregateV2,
  });
  return projet;
};
