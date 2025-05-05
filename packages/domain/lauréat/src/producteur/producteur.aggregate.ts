import { match } from 'ts-pattern';

import { IdentifiantProjet } from '@potentiel-domain/common';
import {
  Aggregate,
  AggregateNotFoundError,
  GetDefaultAggregateState,
  LoadAggregate,
} from '@potentiel-domain/core';

import {
  ProducteurImportéEvent,
  applyProducteurImporté,
  importer,
} from './importer/importerProducteur.behavior';
import {
  applyChangementProducteurEnregistré,
  ChangementProducteurEnregistréEvent,
  enregistrerChangement,
} from './changement/enregistrerChangement/enregistrerChangementProducteur.behavior';
import {
  applyProducteurModifié,
  modifier,
  ProducteurModifiéEvent,
} from './modifier/modifierProducteur.behavior';

export type ProducteurEvent =
  | ProducteurImportéEvent
  | ChangementProducteurEnregistréEvent
  | ProducteurModifiéEvent;

export type ProducteurAggregate = Aggregate<ProducteurEvent> & {
  identifiantProjet: IdentifiantProjet.ValueType;
  producteur: string;
  importer: typeof importer;
  enregistrerChangement: typeof enregistrerChangement;
  modifier: typeof modifier;
};

export const getDefaultProducteurAggregate: GetDefaultAggregateState<
  ProducteurAggregate,
  ProducteurEvent
> = () => ({
  identifiantProjet: IdentifiantProjet.inconnu,
  producteur: '',
  apply,
  importer,
  enregistrerChangement,
  modifier,
});

function apply(this: ProducteurAggregate, event: ProducteurEvent) {
  match(event)
    .with({ type: 'ProducteurImporté-V1' }, applyProducteurImporté.bind(this))
    .with(
      { type: 'ChangementProducteurEnregistré-V1' },
      applyChangementProducteurEnregistré.bind(this),
    )
    .with({ type: 'ProducteurModifié-V1' }, applyProducteurModifié.bind(this))
    .exhaustive();
}

export const loadProducteurFactory =
  (loadAggregate: LoadAggregate) =>
  (identifiantProjet: IdentifiantProjet.ValueType, throwOnNone = true) => {
    return loadAggregate({
      aggregateId: `producteur|${identifiantProjet.formatter()}`,
      getDefaultAggregate: getDefaultProducteurAggregate,
      onNone: throwOnNone
        ? () => {
            throw new ProducteurNonTrouvéError();
          }
        : undefined,
    });
  };

class ProducteurNonTrouvéError extends AggregateNotFoundError {
  constructor() {
    super("Le producteur n'existe pas");
  }
}
