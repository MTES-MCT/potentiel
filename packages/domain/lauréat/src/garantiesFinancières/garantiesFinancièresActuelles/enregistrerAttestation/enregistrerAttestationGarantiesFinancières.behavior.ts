import { DateTime } from '@potentiel-domain/common';
import type { Lauréat } from '@potentiel-domain/projet';

import type { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export function applyEnregistrerAttestationGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  {
    payload: { dateConstitution, attestation },
  }: Lauréat.GarantiesFinancières.AttestationGarantiesFinancièresEnregistréeEvent,
) {
  this.actuelles = {
    ...this.actuelles!,
    dateConstitution: DateTime.convertirEnValueType(dateConstitution),
    attestation,
  };
}
