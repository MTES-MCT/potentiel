import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import { DomainEvent } from '@potentiel-domain/core';

import { StatutGarantiesFinancières, TypeGarantiesFinancières } from '..';
import { GarantiesFinancièresAggregate } from '../garantiesFinancières.aggregate';
import { IdentifiantUtilisateur } from '@potentiel-domain/utilisateur';
import { DateÉchéanceManquante } from '../dateÉchéanceManquante.error';
import { DateÉchéanceNonAttendue } from '../dateÉchéanceNonAttendue.error';

export type TypeGarantiesFinancièresImportéEvent = DomainEvent<
  'TypeGarantiesFinancièresImporté-V1',
  {
    identifiantProjet: IdentifiantProjet.RawType;
    type: TypeGarantiesFinancières.RawType;
    dateÉchéance?: DateTime.RawType;
    importéLe: DateTime.RawType;
    importéPar: IdentifiantUtilisateur.RawType;
  }
>;

export type Options = {
  identifiantProjet: IdentifiantProjet.ValueType;
  type: TypeGarantiesFinancières.ValueType;
  dateÉchéance?: DateTime.ValueType;
  importéLe: DateTime.ValueType;
  importéPar: IdentifiantUtilisateur.ValueType;
};

export async function importerType(
  this: GarantiesFinancièresAggregate,
  { identifiantProjet, type, dateÉchéance, importéLe, importéPar }: Options,
) {
  if (type.estAvecDateÉchéance() && !dateÉchéance) {
    throw new DateÉchéanceManquante();
  }
  if (!type.estAvecDateÉchéance() && dateÉchéance) {
    throw new DateÉchéanceNonAttendue();
  }
  const event: TypeGarantiesFinancièresImportéEvent = {
    type: 'TypeGarantiesFinancièresImporté-V1',
    payload: {
      identifiantProjet: identifiantProjet.formatter(),
      type: type.type,
      dateÉchéance: dateÉchéance?.formatter(),
      importéLe: importéLe.formatter(),
      importéPar: importéPar.formatter(),
    },
  };

  await this.publish(event);
}

export function applyTypeGarantiesFinancièresImporté(
  this: GarantiesFinancièresAggregate,
  { payload: { type, dateÉchéance, importéLe } }: TypeGarantiesFinancièresImportéEvent,
) {
  this.statut = StatutGarantiesFinancières.àTraiter;
  this.validées = {
    type: TypeGarantiesFinancières.convertirEnValueType(type),
    dateÉchéance: dateÉchéance && DateTime.convertirEnValueType(dateÉchéance),
    importéLe: DateTime.convertirEnValueType(importéLe),
  };
}
