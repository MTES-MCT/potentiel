import { DateTime } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { GarantiesFinancièresAggregate } from '../garantiesFinancières.aggregate';

export function applyDemanderGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  event: Lauréat.GarantiesFinancières.GarantiesFinancièresDemandéesEvent,
) {
  this.motifDemandeGarantiesFinancières =
    Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.convertirEnValueType(
      event.payload.motif,
    );
  this.dateLimiteSoumission = DateTime.convertirEnValueType(event.payload.dateLimiteSoumission);
}
