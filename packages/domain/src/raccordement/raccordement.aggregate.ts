import { LoadAggregate } from '@potentiel/core-domain';
import { formatIdentifiantProjet } from '../projet';

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

type RaccordementState = {};

// type RaccordementEvent =

const raccordementAggregateStateFactory = () => {};

export const loadRaccordementAggregateFactory = ({
  loadAggregate,
}: LoadAggregateFactoryDependencies) => {
  return async (identifiantProjet: string) => {
    return loadAggregate<RaccordementState, RaccordementEvent>(
      `raccordement#${formatIdentifiantProjet(identifiantProjet)}`,
      raccordementAggregateStateFactory,
    );
  };
};
