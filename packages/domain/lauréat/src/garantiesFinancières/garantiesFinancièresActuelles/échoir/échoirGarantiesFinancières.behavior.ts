import type { Lauréat } from '@potentiel-domain/projet';

import { StatutGarantiesFinancières } from '../..';
import type { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export function applyGarantiesFinancièresÉchues(
  this: GarantiesFinancièresAggregate,
  _: Lauréat.GarantiesFinancières.GarantiesFinancièresÉchuesEvent,
) {
  if (this.actuelles) {
    this.actuelles.statut = StatutGarantiesFinancières.échu;
  }
}
