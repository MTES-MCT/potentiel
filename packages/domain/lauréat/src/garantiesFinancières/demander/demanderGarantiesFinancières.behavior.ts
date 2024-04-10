import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { GarantiesFinancièresAggregate } from '../garantiesFinancières.aggregate';
import { MotifDemandeGarantiesFinancières } from '..';

export type GarantiesFinancièresDemandéesEvent = DomainEvent<
  'GarantiesFinancièresDemandées-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    dateLimiteSoumission: DateTime.RawType;
    demandéLe: DateTime.RawType;
    motif: MotifDemandeGarantiesFinancières.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  dateLimiteSoumission: DateTime.ValueType;
  demandéLe: DateTime.ValueType;
  motif: MotifDemandeGarantiesFinancières.ValueType;
};

export async function demanderGarantiesFinancières(
  this: GarantiesFinancièresAggregate,
  { dateLimiteSoumission, identifiantProjet, demandéLe, motif }: Options,
) {
  const event: GarantiesFinancièresDemandéesEvent = {
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
