import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { AbandonAggregate } from '../abandon.aggregate';

export function applyAbandonAnnulé(
  this: AbandonAggregate,
  { payload: { annuléLe } }: Lauréat.Abandon.AbandonAnnuléEvent,
) {
  this.statut = Lauréat.Abandon.StatutAbandon.annulé;
  this.annuléLe = DateTime.convertirEnValueType(annuléLe);
  this.accord = undefined;
  this.rejet = undefined;
}
