import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import {
  GestionnaireRéseauAjoutéEventV1,
  ajouter,
  applyGestionnaireRéseauAjouté,
} from './ajouter/ajouterGestionnaireRéseau.behavior';
import * as IdentifiantGestionnaireRéseau from './identifiantGestionnaireRéseau.valueType';
import { GestionnaireRéseauInconnuError } from './gestionnaireRéseauInconnu.error';

export type GestionnaireRéseauEvent = GestionnaireRéseauAjoutéEventV1;

export type GestionnaireRéseauAggregate = Aggregate<GestionnaireRéseauEvent> & {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  readonly ajouter: typeof ajouter;
};

export const getDefaultGestionnaireRéseauAggregate: GetDefaultAggregateState<
  GestionnaireRéseauAggregate,
  GestionnaireRéseauEvent
> = () => ({
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.inconnu,
  apply,
  ajouter,
});

function apply(this: GestionnaireRéseauAggregate, event: GestionnaireRéseauEvent) {
  switch (event.type) {
    case 'GestionnaireRéseauAjouté-V1':
      applyGestionnaireRéseauAjouté.bind(this)(event);
      break;
  }
}

export const loadGestionnaireRéseauFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `gestionnaire-réseau|${identifiantGestionnaireRéseau.formatter()}`,
      getDefaultAggregate: getDefaultGestionnaireRéseauAggregate,
      onNone: throwOnNone
        ? () => {
            throw new GestionnaireRéseauInconnuError();
          }
        : undefined,
    });
  };
