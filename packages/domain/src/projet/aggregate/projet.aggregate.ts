import { AggregateStateFactory, LoadAggregate } from '@potentiel/core-domain';
import { GestionnaireRéseauProjetModifiéEvent } from '../command/modifierGestionnaireRéseau/modifierGestionnaireRéseauProjet.event';
import { IdentifiantProjet, formatIdentifiantProjet } from '../valueType/identifiantProjet';

type ProjetAggregateId = `projet#${string}`;

export const createProjetAggregateId = (
  identifiantProjet: IdentifiantProjet,
): ProjetAggregateId => {
  return `projet#${formatIdentifiantProjet(identifiantProjet)}`;
};

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

type ProjetState = { gestionnaireRéseau: { codeEIC: string } };

const defaultAggregateState: ProjetState = {
  gestionnaireRéseau: { codeEIC: '' },
};

export type ProjetEvent = GestionnaireRéseauProjetModifiéEvent;

const projetAggregateStateFactory: AggregateStateFactory<ProjetState, ProjetEvent> = (events) => {
  return events.reduce((aggregate, event) => {
    switch (event.type) {
      case 'GestionnaireRéseauProjetModifié':
        return {
          ...aggregate,
          gestionnaireRéseau: { codeEIC: event.payload.identifiantGestionnaireRéseau },
        };
      default:
        return { ...aggregate };
    }
  }, defaultAggregateState);
};

export const loadProjetAggregateFactory = ({ loadAggregate }: LoadAggregateFactoryDependencies) => {
  return async (identifiantProjet: IdentifiantProjet) => {
    return loadAggregate<ProjetState, ProjetEvent>(
      createProjetAggregateId(identifiantProjet),
      projetAggregateStateFactory,
    );
  };
};
