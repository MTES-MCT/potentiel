import { Lauréat } from '@potentiel-domain/projet';

import { GarantiesFinancièresAggregate } from '../garantiesFinancières.aggregate';

export function applyEffacerHistoriqueGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  _: Lauréat.GarantiesFinancières.HistoriqueGarantiesFinancièresEffacéEvent,
) {
  this.actuelles = undefined;
  this.dépôtsEnCours = undefined;
}
