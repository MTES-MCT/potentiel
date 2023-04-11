import { AggregateStateFactory, LoadAggregate } from '@potentiel/core-domain';
import { DemandeComplèteRaccordementTransmiseEvent } from './demandeComplèteRaccordement';

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

type RaccordementState = { gestionnaireRéseau: { codeEIC: string } };

const defaultAggregateState: RaccordementState = { gestionnaireRéseau: { codeEIC: '' } };

type RaccordementEvent = DemandeComplèteRaccordementTransmiseEvent;

const raccordementAggregateStateFactory: AggregateStateFactory<
  RaccordementState,
  RaccordementEvent
> = (events) => {
  return events.reduce((aggregate, event) => {
    switch (event.type) {
      case 'DemandeComplèteDeRaccordementTransmise':
        return {
          ...aggregate,
          gestionnaireRéseau: { codeEIC: event.payload.identifiantGestionnaireRéseau },
        };
      default:
        return { ...aggregate };
    }
  }, defaultAggregateState);
};

export const loadRaccordementAggregateFactory = ({
  loadAggregate,
}: LoadAggregateFactoryDependencies) => {
  return async (identifiantProjet: string) => {
    return loadAggregate<RaccordementState, RaccordementEvent>(
      `raccordement#${identifiantProjet}`,
      raccordementAggregateStateFactory,
    );
  };
};
