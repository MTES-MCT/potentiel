import { DateTime } from '@potentiel-domain/common';
import { Candidature, type Lauréat } from '@potentiel-domain/projet';

import { StatutGarantiesFinancières } from '../..';
import type { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export function applyEnregistrerGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  {
    payload: { type, dateÉchéance, dateConstitution, attestation },
  }: Lauréat.GarantiesFinancières.GarantiesFinancièresEnregistréesEvent,
) {
  this.actuelles = {
    ...this.actuelles,
    statut: StatutGarantiesFinancières.validé,
    type: Candidature.TypeGarantiesFinancières.convertirEnValueType(type),
    dateÉchéance: dateÉchéance && DateTime.convertirEnValueType(dateÉchéance),
    dateConstitution: DateTime.convertirEnValueType(dateConstitution),
    attestation,
  };
}
