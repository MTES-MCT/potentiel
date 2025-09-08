import { Lauréat } from '@potentiel-domain/projet';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export function applyGarantiesFinancièresÉchues(
  this: GarantiesFinancièresAggregate,
  _: Lauréat.GarantiesFinancières.GarantiesFinancièresÉchuesEvent,
) {
  if (this.actuelles) {
    this.actuelles.statut = Lauréat.GarantiesFinancières.StatutGarantiesFinancières.échu;
  }
}
