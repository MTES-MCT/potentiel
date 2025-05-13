import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DomainEvent } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { AbandonAggregate } from '../abandon.aggregate';

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
  this.statut.vérifierQueLeChangementDeStatutEstPossibleEn(Lauréat.Abandon.StatutAbandon.confirmé);

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
  this.statut = Lauréat.Abandon.StatutAbandon.confirmé;

  if (this.demande.confirmation) {
    this.demande.confirmation.confirméLe = DateTime.convertirEnValueType(confirméLe);
  }
}
