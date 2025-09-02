import { Lauréat } from '@potentiel-domain/projet';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export function applyDépôtGarantiesFinancièresEnCoursSupprimé(
  this: GarantiesFinancièresAggregate,
  _:
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEventV1
    | Lauréat.GarantiesFinancières.DépôtGarantiesFinancièresEnCoursSuppriméEvent,
) {
  this.dépôtsEnCours = undefined;
}
