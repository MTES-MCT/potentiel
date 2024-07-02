import { Aggregate, GetDefaultAggregateState, LoadAggregate } from '@potentiel-domain/core';
import { ExpressionRegulière } from '@potentiel-domain/common';

import {
  GestionnaireRéseauAjoutéEvent,
  GestionnaireRéseauAjoutéEventV1,
  ajouter,
  applyGestionnaireRéseauAjouté,
} from './ajouter/ajouterGestionnaireRéseau.behavior';
import * as IdentifiantGestionnaireRéseau from './identifiantGestionnaireRéseau.valueType';
import { GestionnaireRéseauInconnuError } from './gestionnaireRéseauInconnu.error';
import {
  GestionnaireRéseauModifiéEvent,
  GestionnaireRéseauModifiéEventV1,
  applyGestionnaireRéseauModifié,
  modifier,
} from './modifier/modifierGestionnaireRéseau.behavior';

export type GestionnaireRéseauEvent =
  | GestionnaireRéseauAjoutéEventV1
  | GestionnaireRéseauAjoutéEvent
  | GestionnaireRéseauModifiéEventV1
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
  référenceDossierRaccordementExpressionRegulière: ExpressionRegulière.accepteTout,
  apply,
  ajouter,
  modifier,
});

function apply(this: GestionnaireRéseauAggregate, event: GestionnaireRéseauEvent) {
  switch (event.type) {
    case 'GestionnaireRéseauAjouté-V1':
    case 'GestionnaireRéseauAjouté-V2':
      applyGestionnaireRéseauAjouté.bind(this)(event);
      break;
    case 'GestionnaireRéseauModifié-V1':
    case 'GestionnaireRéseauModifié-V2':
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
            if (!identifiantGestionnaireRéseau.estÉgaleÀ(IdentifiantGestionnaireRéseau.inconnu)) {
              throw new GestionnaireRéseauInconnuError();
            }
          }
        : undefined,
    });
  };
