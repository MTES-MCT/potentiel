import { AggregateStateFactory, LoadAggregate } from '@potentiel/core-domain';
import { GestionnaireRéseauAjoutéEvent } from '../command/ajouter/gestionnaireRéseauAjouté.event';
import { GestionnaireRéseauModifiéEvent } from '../command/modifier/gestionnaireRéseauModifié.event';

type GestionnaireRéseauAggregateId = `gestionnaire-réseau#${string}`;

export const createGestionnaireRéseauAggregateId = (
  codeEIC: string,
): GestionnaireRéseauAggregateId => `gestionnaire-réseau#${codeEIC}`;

type GestionnaireRéseauState = {
  codeEIC: string;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement?: { format: string; légende: string };
  expressionReguliere?: string;
};

export type GestionnaireRéseauEvent =
  | GestionnaireRéseauModifiéEvent
  | GestionnaireRéseauAjoutéEvent;

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
