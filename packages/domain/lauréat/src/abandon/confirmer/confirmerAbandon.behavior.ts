import { Lauréat } from '@potentiel-domain/projet';

import { AbandonAggregate } from '../abandon.aggregate';

export function applyAbandonConfirmé(
  this: AbandonAggregate,
  _: Lauréat.Abandon.AbandonConfirméEvent,
) {
  this.statut = Lauréat.Abandon.StatutAbandon.confirmé;
}
