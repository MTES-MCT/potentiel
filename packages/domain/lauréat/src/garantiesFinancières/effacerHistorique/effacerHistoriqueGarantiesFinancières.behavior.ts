import type { Lauréat } from '@potentiel-domain/projet';

import type { GarantiesFinancièresAggregate } from '../garantiesFinancières.aggregate';

export function applyEffacerHistoriqueGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  _: Lauréat.GarantiesFinancières.HistoriqueGarantiesFinancièresEffacéEvent,
) {
  this.actuelles = undefined;
  this.dépôtsEnCours = undefined;
}
