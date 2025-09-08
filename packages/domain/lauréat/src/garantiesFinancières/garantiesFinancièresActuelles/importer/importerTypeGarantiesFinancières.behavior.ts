import { DateTime } from '@potentiel-domain/common';
import { Candidature, Lauréat } from '@potentiel-domain/projet';

import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export function applyTypeGarantiesFinancièresImporté(
  this: GarantiesFinancièresAggregate,
  {
    payload: { type, dateÉchéance, importéLe },
  }: Lauréat.GarantiesFinancières.TypeGarantiesFinancièresImportéEvent,
) {
  this.actuelles = {
    ...this.actuelles,
    statut: Lauréat.GarantiesFinancières.StatutGarantiesFinancières.validé,
    type: Candidature.TypeGarantiesFinancières.convertirEnValueType(type),
    dateÉchéance: dateÉchéance && DateTime.convertirEnValueType(dateÉchéance),
    importéLe: DateTime.convertirEnValueType(importéLe),
  };
}
