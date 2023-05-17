import { AggregateStateFactory, LoadAggregate } from '@potentiel/core-domain';
import { IdentifiantProjet, formatIdentifiantProjet } from '../projet';
import { DemandeComplèteRaccordementTransmiseEvent } from './demandeCompléteRaccordement/transmettre';
import { DemandeComplèteRaccordementModifiéeEvent } from './demandeCompléteRaccordement/modifier';

type RaccordementAggregateId = `raccordement#${string}`;

export const createRaccordementAggregateId = (
  identifiantProjet: IdentifiantProjet,
): RaccordementAggregateId => {
  return `raccordement#${formatIdentifiantProjet(identifiantProjet)}`;
};

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

type RaccordementState = { gestionnaireRéseau: { codeEIC: string }; références: string[] };

const defaultAggregateState: RaccordementState = {
  gestionnaireRéseau: { codeEIC: '' },
  références: [],
};

type RaccordementEvent =
  | DemandeComplèteRaccordementTransmiseEvent
  | DemandeComplèteRaccordementModifiéeEvent;

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
          références: [...aggregate.références, event.payload.référenceDossierRaccordement],
        };
      case 'DemandeComplèteRaccordementModifiée':
        return {
          ...aggregate,
          références: [...aggregate.références, event.payload.nouvelleReference].filter(
            (référence) => référence !== event.payload.referenceActuelle,
          ),
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
