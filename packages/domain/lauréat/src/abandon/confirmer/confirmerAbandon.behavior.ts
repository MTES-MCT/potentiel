import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { Lauréat } from '@potentiel-domain/projet';

import { AbandonAggregate } from '../abandon.aggregate';

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

  const event: Lauréat.Abandon.AbandonConfirméEvent = {
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
  _: Lauréat.Abandon.AbandonConfirméEvent,
) {
  this.statut = Lauréat.Abandon.StatutAbandon.confirmé;
}
