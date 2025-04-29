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

export type ProducteurEvent = ProducteurImportéEvent;

export type ProducteurAggregate = Aggregate<ProducteurEvent> & {
  identifiantProjet: IdentifiantProjet.ValueType;
  producteur: string;
  importer: typeof importer;
};

export const getDefaultProducteurAggregate: GetDefaultAggregateState<
  ProducteurAggregate,
  ProducteurEvent
> = () => ({
  identifiantProjet: IdentifiantProjet.inconnu,
  producteur: '',
  apply,
  importer,
});

function apply(this: ProducteurAggregate, event: ProducteurEvent) {
  switch (event.type) {
    case 'ProducteurImporté-V1':
      applyProducteurImporté.bind(this)(event);
      break;
  }
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
