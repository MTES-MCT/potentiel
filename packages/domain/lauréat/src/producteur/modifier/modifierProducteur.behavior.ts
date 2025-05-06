import { DomainEvent } from '@potentiel-domain/core';
import { DateTime, Email, IdentifiantProjet } from '@potentiel-domain/common';

import { ProducteurAggregate } from '../producteur.aggregate';
import { ProducteurIdentiqueError } from '../changement/errors';

export type ProducteurModifiéEvent = DomainEvent<
  'ProducteurModifié-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    producteur: string;
    modifiéLe: DateTime.RawType;
    modifiéPar: Email.RawType;
  }
>;

export type ModifierOptions = {
  identifiantProjet: IdentifiantProjet.ValueType;
  identifiantUtilisateur: Email.ValueType;
  producteur: string;
  dateModification: DateTime.ValueType;
};

export async function modifier(
  this: ProducteurAggregate,
  { identifiantProjet, producteur, dateModification, identifiantUtilisateur }: ModifierOptions,
) {
  if (this.producteur === producteur) {
    throw new ProducteurIdentiqueError();
  }

  const event: ProducteurModifiéEvent = {
    type: 'ProducteurModifié-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      producteur,
      modifiéLe: dateModification.formatter(),
      modifiéPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyProducteurModifié(
  this: ProducteurAggregate,
  { payload: { producteur } }: ProducteurModifiéEvent,
) {
  this.producteur = producteur;
}
