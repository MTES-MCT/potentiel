import { AggregateFactory, LoadAggregate } from '@potentiel/core-domain';
import {
  GestionnaireRéseau,
  loadGestionnaireRéseauAggregateFactory,
} from '../gestionnaireRéseau/gestionnaireRéseau.aggregate';
import { IdentifiantProjetValueType } from './projet.valueType';
import { ProjetEvent } from './projet.event';
import { Option, none } from '@potentiel/monads';
import { convertirEnIdentifiantGestionnaireRéseau } from '../domain.valueType';

type ProjetAggregateId = `projet#${string}`;

export const createProjetAggregateId = (
  identifiantProjet: IdentifiantProjetValueType,
): ProjetAggregateId => {
  return `projet#${identifiantProjet.formatter()}`;
};

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

export type Projet = { getGestionnaireRéseau(): Promise<Option<GestionnaireRéseau>> };

const defaultAggregate: Projet = {
  getGestionnaireRéseau: async () => Promise.resolve(none),
};

const projetAggregateFactory: AggregateFactory<Projet, ProjetEvent> = (events, loadAggregate) => {
  return events.reduce((aggregate, event) => {
    switch (event.type) {
      case 'GestionnaireRéseauProjetModifié':
        return {
          ...aggregate,
          getGestionnaireRéseau: async () => {
            const loadGestionnaireRéseau = loadGestionnaireRéseauAggregateFactory({
              loadAggregate,
            });
            return loadGestionnaireRéseau(
              convertirEnIdentifiantGestionnaireRéseau(event.payload.identifiantGestionnaireRéseau),
            );
          },
        };
      default:
        return { ...aggregate };
    }
  }, defaultAggregate);
};

export const loadProjetAggregateFactory = ({ loadAggregate }: LoadAggregateFactoryDependencies) => {
  return async (identifiantProjet: IdentifiantProjetValueType) => {
    return loadAggregate<Projet, ProjetEvent>(
      createProjetAggregateId(identifiantProjet),
      projetAggregateFactory,
    );
  };
};
