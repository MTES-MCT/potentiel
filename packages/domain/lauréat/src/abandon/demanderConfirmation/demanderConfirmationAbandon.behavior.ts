import { Lauréat } from '@potentiel-domain/projet';

import { AbandonAggregate } from '../abandon.aggregate';

export function applyConfirmationAbandonDemandée(
  this: AbandonAggregate,
  _: Lauréat.Abandon.ConfirmationAbandonDemandéeEvent,
) {
  this.statut = Lauréat.Abandon.StatutAbandon.confirmationDemandée;
}
