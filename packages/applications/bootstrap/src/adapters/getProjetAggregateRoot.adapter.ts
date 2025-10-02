import { GetProjetAggregateRoot, ProjetAggregateRoot } from '@potentiel-domain/projet';
import { AppelOffreAdapter } from '@potentiel-infrastructure/domain-adapters';
import { loadAggregateV2 } from '@potentiel-infrastructure/pg-event-sourcing';

export const getProjetAggregateRootAdapter: GetProjetAggregateRoot = async (
  identifiant,
  skipInitialization,
) => {
  const projet = await ProjetAggregateRoot.get(
    identifiant,
    {
      loadAggregate: loadAggregateV2,
      loadAppelOffreAggregate: AppelOffreAdapter.loadAppelOffreAggregateAdapter,
    },
    skipInitialization,
  );
  return projet;
};
