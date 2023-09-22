import { AggregateFactory, LoadAggregate } from '@potentiel/core-domain';
import {
  GestionnaireRéseau,
  loadGestionnaireRéseauAggregateFactory,
} from '../../../gestionnaireRéseau/gestionnaireRéseau.aggregate';
import { IdentifiantProjetValueType } from '../../projet.valueType';
import { GestionnaireRéseauProjetEvent } from './gestionnaireRéseauProjet.event';
import { Option, none } from '@potentiel/monads';
import { convertirEnIdentifiantGestionnaireRéseau } from '../../../domain.valueType';

/**
 * @deprecated
 * La catégory de ce stream n'est plus la bonne
 */
type GestionRéseauProjetAggregateId = `projet|${string}`;

export const createGestionnaireRéseauProjetAggregateId = (
  identifiantProjet: IdentifiantProjetValueType,
): GestionRéseauProjetAggregateId => {
  return `projet|${identifiantProjet.formatter()}`;
};

type LoadAggregateFactoryDependencies = { loadAggregate: LoadAggregate };

export type GestionnaireRéseauProjet = {
  getGestionnaireRéseau(): Promise<Option<GestionnaireRéseau>>;
};

const getDefaultAggregate = (): GestionnaireRéseauProjet => ({
  getGestionnaireRéseau: async () => Promise.resolve(none),
});

const gestionnaireRéseauProjetAggregateFactory: AggregateFactory<
  GestionnaireRéseauProjet,
  GestionnaireRéseauProjetEvent
> = (events, loadAggregate) => {
  return events.reduce((aggregate, event) => {
    switch (event.type) {
      case 'GestionnaireRéseauProjetDéclaré':
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
  }, getDefaultAggregate());
};

export const loadGestionnaireRéseauProjetAggregateFactory = ({
  loadAggregate,
}: LoadAggregateFactoryDependencies) => {
  return async (identifiantProjet: IdentifiantProjetValueType) => {
    return loadAggregate<GestionnaireRéseauProjet, GestionnaireRéseauProjetEvent>(
      createGestionnaireRéseauProjetAggregateId(identifiantProjet),
      gestionnaireRéseauProjetAggregateFactory,
    );
  };
};
