import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { StatutGarantiesFinancières, TypeGarantiesFinancières } from '../..';
import { DateÉchéanceManquanteError } from '../../dateÉchéanceManquante.error';
import { DateÉchéanceNonAttendueError } from '../../dateÉchéanceNonAttendue.error';
import { GarantiesFinancièresAggregate } from '../../garantiesFinancières.aggregate';

export type TypeGarantiesFinancièresImportéEvent = DomainEvent<
  'TypeGarantiesFinancièresImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    type: TypeGarantiesFinancières.RawType;
    dateÉchéance?: DateTime.RawType;
    importéLe: DateTime.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  type: TypeGarantiesFinancières.ValueType;
  dateÉchéance?: DateTime.ValueType;
  importéLe: DateTime.ValueType;
};

export async function importerType(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, type, dateÉchéance, importéLe }: Options,
) {
  if (type.estAvecDateÉchéance() && !dateÉchéance) {
    throw new DateÉchéanceManquanteError();
  }
  if (!type.estAvecDateÉchéance() && dateÉchéance) {
    throw new DateÉchéanceNonAttendueError();
  }
  const event: TypeGarantiesFinancièresImportéEvent = {
    type: 'TypeGarantiesFinancièresImporté-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      type: type.type,
      dateÉchéance: dateÉchéance?.formatter(),
      importéLe: importéLe.formatter(),
    },
  };

  await this.publish(event);
}

export function applyTypeGarantiesFinancièresImporté(
  this: GarantiesFinancièresAggregate,
  { payload: { type, dateÉchéance, importéLe } }: TypeGarantiesFinancièresImportéEvent,
) {
  this.actuelles = {
    statut: StatutGarantiesFinancières.validé,
    type: TypeGarantiesFinancières.convertirEnValueType(type),
    dateÉchéance: dateÉchéance && DateTime.convertirEnValueType(dateÉchéance),
    importéLe: DateTime.convertirEnValueType(importéLe),
  };
}
