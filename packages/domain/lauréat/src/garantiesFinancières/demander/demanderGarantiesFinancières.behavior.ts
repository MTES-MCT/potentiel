import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { Lauréat } from '@potentiel-domain/projet';

import { GarantiesFinancièresAggregate } from '../garantiesFinancières.aggregate';

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dateLimiteSoumission: DateTime.ValueType;
  demandéLe: DateTime.ValueType;
  motif: Lauréat.GarantiesFinancières.MotifDemandeGarantiesFinancières.ValueType;
};

export async function demanderGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  { dateLimiteSoumission, identifiantProjet, demandéLe, motif }: Options,
) {
  const event: Lauréat.GarantiesFinancières.GarantiesFinancièresDemandéesEvent = {
    type: 'GarantiesFinancièresDemandées-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      dateLimiteSoumission: dateLimiteSoumission.formatter(),
      demandéLe: demandéLe.formatter(),
      motif: motif.motif,
    },
  };

  await this.publish(event);
}

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
