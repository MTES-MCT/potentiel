import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { AbandonAggregate } from '../abandon.aggregate';

export function applyAbandonRejeté(
  this: AbandonAggregate,
  { payload: { rejetéLe, réponseSignée } }: Lauréat.Abandon.AbandonRejetéEvent,
) {
  this.statut = Lauréat.Abandon.StatutAbandon.rejeté;

  this.rejet = {
    rejetéLe: DateTime.convertirEnValueType(rejetéLe),
    réponseSignée,
  };
  this.accord = undefined;
}
