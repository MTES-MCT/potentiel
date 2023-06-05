import { AggregateFactory, LoadAggregate } from '@potentiel/core-domain';
import {
  GestionnaireRéseau,
  loadGestionnaireRéseauAggregateFactory,
} from '../gestionnaireRéseau/gestionnaireRéseau.aggregate';
import { IdentifiantProjet, formatIdentifiantProjet } from './projet.valueType';
import { ProjetEvent } from './projet.event';
import { Option, none } from '@potentiel/monads';
import { parseIdentifiantGestionnaireRéseau } from '../domain.valueType';

type ProjetAggregateId = `projet#${string}`;

export const createProjetAggregateId = (
  identifiantProjet: IdentifiantProjet,
): ProjetAggregateId => {
  return `projet#${formatIdentifiantProjet(identifiantProjet)}`;
};

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

export type Projet = { gestionnaireRéseau(): Promise<Option<GestionnaireRéseau>> };

const defaultAggregate: Projet = {
  gestionnaireRéseau: async () => Promise.resolve(none),
};

const projetAggregateFactory: AggregateFactory<Projet, ProjetEvent> = (events, loadAggregate) => {
  return events.reduce((aggregate, event) => {
    switch (event.type) {
      case 'GestionnaireRéseauProjetModifié':
        return {
          ...aggregate,
          gestionnaireRéseau: async () => {
            const loadGestionnaireRéseau = loadGestionnaireRéseauAggregateFactory({
              loadAggregate,
            });
            return loadGestionnaireRéseau(
              parseIdentifiantGestionnaireRéseau(event.payload.identifiantGestionnaireRéseau),
            );
          },
        };
      default:
        return { ...aggregate };
    }
  }, defaultAggregate);
};

export const loadProjetAggregateFactory = ({ loadAggregate }: LoadAggregateFactoryDependencies) => {
  return async (identifiantProjet: IdentifiantProjet) => {
    return loadAggregate<Projet, ProjetEvent>(
      createProjetAggregateId(identifiantProjet),
      projetAggregateFactory,
    );
  };
};
