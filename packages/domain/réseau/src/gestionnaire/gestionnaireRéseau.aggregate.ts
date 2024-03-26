import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import {
  GestionnaireRéseauAjoutéEvent,
  ajouter,
  applyGestionnaireRéseauAjouté,
} from './ajouter/ajouterGestionnaireRéseau.behavior';
import * as IdentifiantGestionnaireRéseau from './identifiantGestionnaireRéseau.valueType';
import { GestionnaireRéseauInconnuError } from './gestionnaireRéseauInconnu.error';
import {
  GestionnaireRéseauModifiéEvent,
  applyGestionnaireRéseauModifié,
  modifier,
} from './modifier/modifierGestionnaireRéseau.behavior';
import { ExpressionRegulière } from '@potentiel-domain/common';

export type GestionnaireRéseauEvent =
  | GestionnaireRéseauAjoutéEvent
  | GestionnaireRéseauModifiéEvent;

export type GestionnaireRéseauAggregate = Aggregate<GestionnaireRéseauEvent> & {
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.ValueType;
  référenceDossierRaccordementExpressionRegulière: ExpressionRegulière.ValueType;
  readonly ajouter: typeof ajouter;
  readonly modifier: typeof modifier;
};

export const getDefaultGestionnaireRéseauAggregate: GetDefaultAggregateState<
  GestionnaireRéseauAggregate,
  GestionnaireRéseauEvent
> = () => ({
  identifiantGestionnaireRéseau: IdentifiantGestionnaireRéseau.inconnu,
  référenceDossierRaccordementExpressionRegulière: ExpressionRegulière.défaut,
  apply,
  ajouter,
  modifier,
});

function apply(this: GestionnaireRéseauAggregate, event: GestionnaireRéseauEvent) {
  switch (event.type) {
    case 'GestionnaireRéseauAjouté-V1':
      applyGestionnaireRéseauAjouté.bind(this)(event);
      break;
    case 'GestionnaireRéseauModifié-V1':
      applyGestionnaireRéseauModifié.bind(this)(event);
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
