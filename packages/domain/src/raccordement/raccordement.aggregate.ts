import { AggregateStateFactory, LoadAggregate } from '@potentiel/core-domain';
import { IdentifiantProjet, formatIdentifiantProjet } from '../projet';
import { DemandeComplèteRaccordementTransmiseEvent } from './transmettreDemandeComplèteRaccordement/demandeComplèteRaccordementTransmise.event';

type RaccordementAggregateId = `raccordement#${string}`;

export const createRaccordementAggregateId = (
  identifiantProjet: IdentifiantProjet,
): RaccordementAggregateId => {
  return `raccordement#${formatIdentifiantProjet(identifiantProjet)}`;
};

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
  return async (identifiantProjet: IdentifiantProjet) => {
    return loadAggregate<RaccordementState, RaccordementEvent>(
      createRaccordementAggregateId(identifiantProjet),
      raccordementAggregateStateFactory,
    );
  };
};
