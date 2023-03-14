import { DomainEvent, EventStoreAggregate, UniqueEntityID } from '@core/domain';
import { ok } from '@core/utils';
import { AggregateStateFactory, LoadAggregate } from '@potentiel/core-domain';
import { GestionnaireRéseauAjouté } from './ajouter';
import { GestionnaireRéseauAjoutéEvent } from './ajouter/gestionnaireRéseauAjoutéEvent';
import { GestionnaireRéseauModifiéEvent } from './modifier/gestionnaireRéseauModifié.event';

type GestionnaireRéseauArgs = {
  id: UniqueEntityID;
  events?: DomainEvent[];
};

export type GestionnaireRéseau = EventStoreAggregate & {
  codeEIC: string;
  raisonSociale: string;
  légende: string;
  format: string;
};

export const makeGestionnaireRéseau = (args: GestionnaireRéseauArgs) => {
  const { events = [], id } = args;

  const agrégat = events.reduce<GestionnaireRéseau>(
    (agrégat, event) => {
      switch (event.type) {
        case GestionnaireRéseauAjouté.name:
          return { ...agrégat, ...event.payload, id: new UniqueEntityID(event.payload.codeEIC) };
        default:
          return { ...agrégat };
      }
    },
    {
      id,
      codeEIC: '',
      raisonSociale: '',
      légende: '',
      format: '',
      pendingEvents: [],
    },
  );
  return ok(agrégat);
};

// nouveau monde
type GestionnaireRéseauAggregateId = `gestionnaire-réseau#${string}`;

export const createGestionnaireRéseauAggregateId = (
  codeEIC: string,
): GestionnaireRéseauAggregateId => `gestionnaire-réseau#${codeEIC}`;

export type GestionnaireRéseauState = {
  codeEIC: string;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement?: { format: string; légende: string };
};
type GestionnaireRéseauEvent = GestionnaireRéseauModifiéEvent | GestionnaireRéseauAjoutéEvent;

const defaultAggregateState: GestionnaireRéseauState = {
  raisonSociale: '',
  codeEIC: '',
};

const gestionnaireRéseauAggregateStateFactory: AggregateStateFactory<
  GestionnaireRéseauState,
  GestionnaireRéseauEvent
> = (events) => {
  return events.reduce((aggregate, event) => {
    switch (event.type) {
      case 'GestionnaireRéseauAjouté':
      case 'GestionnaireRéseauModifié':
        return { ...aggregate, ...event.payload };
      default:
        // TODO: ajouter log event non connu
        return { ...aggregate };
    }
  }, defaultAggregateState);
};

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

export const loadGestionnaireRéseauAggregateFactory = ({
  loadAggregate,
}: LoadAggregateFactoryDependencies) => {
  return async (codeEIC: string) => {
    return loadAggregate<GestionnaireRéseauState, GestionnaireRéseauEvent>(
      createGestionnaireRéseauAggregateId(codeEIC),
      gestionnaireRéseauAggregateStateFactory,
    );
  };
};
