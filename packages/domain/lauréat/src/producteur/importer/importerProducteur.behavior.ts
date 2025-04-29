import { DomainError, DomainEvent } from '@potentiel-domain/core';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';

import { ProducteurAggregate } from '../producteur.aggregate';

export type ProducteurImportéEvent = DomainEvent<
  'ProducteurImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    producteur: string;
    importéLe: DateTime.RawType;
  }
>;

export type ImporterOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  producteur: string;
  importéLe: DateTime.ValueType;
};

export async function importer(
  this: ProducteurAggregate,
  { identifiantProjet, producteur, importéLe }: ImporterOptions,
) {
  if (this.producteur) {
    throw new ProducteurDéjàImportéError();
  }

  const event: ProducteurImportéEvent = {
    type: 'ProducteurImporté-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      producteur,
      importéLe: importéLe.formatter(),
    },
  };

  await this.publish(event);
}

export function applyProducteurImporté(
  this: ProducteurAggregate,
  { payload: { producteur, identifiantProjet } }: ProducteurImportéEvent,
) {
  this.identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjet);
  this.producteur = producteur;
}

class ProducteurDéjàImportéError extends DomainError {
  constructor() {
    super('Le producteur a déjà été importé');
  }
}
