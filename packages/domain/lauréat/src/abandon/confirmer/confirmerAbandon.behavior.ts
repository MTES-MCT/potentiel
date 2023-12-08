import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DomainEvent } from '@potentiel-domain/core';

import { AbandonAggregate } from '../abandon.aggregate';
import * as StatutAbandon from '../statutAbandon.valueType';

export type AbandonConfirméEvent = DomainEvent<
  'AbandonConfirmé-V1',
  {
    confirméLe: DateTime.RawType;
    confirméPar: IdentifiantUtilisateur.RawType;
    identifiantProjet: IdentifiantProjet.RawType;
  }
>;

export type ConfirmerOptions = {
  dateConfirmation: DateTime.ValueType;
  identifiantUtilisateur: IdentifiantUtilisateur.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
};

export async function confirmer(
  this: AbandonAggregate,
  { dateConfirmation, identifiantUtilisateur, identifiantProjet }: ConfirmerOptions,
) {
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(StatutAbandon.confirmé);

  const event: AbandonConfirméEvent = {
    type: 'AbandonConfirmé-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      confirméLe: dateConfirmation.formatter(),
      confirméPar: identifiantUtilisateur.formatter(),
    },
  };

  await this.publish(event);
}

export function applyAbandonConfirmé(
  this: AbandonAggregate,
  { payload: { confirméLe } }: AbandonConfirméEvent,
) {
  this.statut = StatutAbandon.confirmé;

  if (this.demande.confirmation) {
    this.demande.confirmation.confirméLe = DateTime.convertirEnValueType(confirméLe);
  }
}
