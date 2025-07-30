import { match } from 'ts-pattern';

import { DateTime } from '@potentiel-domain/common';
import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import { TypeGarantiesFinancières } from '../../candidature';

import {
  DateDélibérationNonAttendueError,
  DateDélibérationRequiseError,
  DateÉchéanceGarantiesFinancièresRequiseError,
  DateÉchéanceNonAttendueError,
} from './garantiesFinancières.error';

export type RawType =
  | {
      type: 'consignation' | 'six-mois-après-achèvement' | 'garantie-bancaire';
    }
  | {
      type: 'avec-date-échéance';
      dateÉchéance: DateTime.RawType;
    }
  | {
      type: 'exemption';
      dateDélibération: DateTime.RawType;
    };

type ConsignationValueType = {
  type: TypeGarantiesFinancières.ValueType<'consignation'>;
};

type SixMoisAprèsAchèvementValueType = {
  type: TypeGarantiesFinancières.ValueType<'six-mois-après-achèvement'>;
};
type GarantiesBancairesValueType = {
  type: TypeGarantiesFinancières.ValueType<'garantie-bancaire'>;
};
type AvecDateÉchéanceValueType = {
  type: TypeGarantiesFinancières.ValueType<'avec-date-échéance'>;
  dateÉchéance: DateTime.ValueType;
};
type ExemptionValueType = {
  type: TypeGarantiesFinancières.ValueType<'exemption'>;
  dateDélibération: DateTime.ValueType;
};

export type ValueType<
  Type extends TypeGarantiesFinancières.RawType = TypeGarantiesFinancières.RawType,
> = ReadonlyValueType<
  (
    | (Type extends 'consignation' ? ConsignationValueType : never)
    | (Type extends 'six-mois-après-achèvement' ? SixMoisAprèsAchèvementValueType : never)
    | (Type extends 'garantie-bancaire' ? GarantiesBancairesValueType : never)
    | (Type extends 'avec-date-échéance' ? AvecDateÉchéanceValueType : never)
    | (Type extends 'exemption' ? ExemptionValueType : never)
  ) & {
    formatter(): RawType;
    estAvecDateÉchéance(): this is ValueType<'avec-date-échéance'>;
    estExemption(): this is ValueType<'exemption'>;
  }
>;

export const bind = (plain: PlainType<ValueType>): ValueType => {
  return match(plain)
    .returnType<ValueType>()
    .with({ type: { type: 'consignation' } }, () => ({
      type: TypeGarantiesFinancières.consignation,
      estÉgaleÀ: (valueType) => valueType.type.type === 'consignation',
      formatter: () => ({ type: 'consignation' }),
      estAvecDateÉchéance: (): this is ValueType<'avec-date-échéance'> => false,
      estExemption: (): this is ValueType<'exemption'> => false,
    }))
    .with({ type: { type: 'six-mois-après-achèvement' } }, () => ({
      type: TypeGarantiesFinancières.sixMoisAprèsAchèvement,
      estÉgaleÀ: (valueType) => valueType.type.type === 'six-mois-après-achèvement',
      formatter: () => ({ type: 'six-mois-après-achèvement' }),
      estAvecDateÉchéance: (): this is ValueType<'avec-date-échéance'> => false,
      estExemption: (): this is ValueType<'exemption'> => false,
    }))
    .with({ type: { type: 'garantie-bancaire' } }, () => ({
      type: TypeGarantiesFinancières.garantieBancaire,
      estÉgaleÀ: (valueType) => valueType.type.type === 'garantie-bancaire',
      formatter: () => ({ type: 'garantie-bancaire' }),
      estAvecDateÉchéance: (): this is ValueType<'avec-date-échéance'> => false,
      estExemption: (): this is ValueType<'exemption'> => false,
    }))
    .with({ type: { type: 'avec-date-échéance' } }, ({ dateÉchéance }) => ({
      type: TypeGarantiesFinancières.avecDateÉchéance,
      dateÉchéance: vérifierDateÉchéance(dateÉchéance?.date),
      estÉgaleÀ(valueType: ValueType) {
        const raw = valueType.formatter();
        return raw.type === 'avec-date-échéance' && raw.dateÉchéance === dateÉchéance.date;
      },
      formatter() {
        return {
          type: 'avec-date-échéance',
          dateÉchéance: vérifierDateÉchéance(dateÉchéance?.date).formatter(),
        };
      },
      estAvecDateÉchéance: (): this is ValueType<'avec-date-échéance'> => true,
      estExemption: (): this is ValueType<'exemption'> => false,
    }))
    .with({ type: { type: 'exemption' } }, ({ dateDélibération }) => ({
      type: TypeGarantiesFinancières.exemption,
      dateDélibération: vérifierDateDélibération(dateDélibération?.date),
      estÉgaleÀ(valueType: ValueType) {
        const raw = valueType.formatter();
        return raw.type === 'exemption' && raw.dateDélibération === dateDélibération.date;
      },
      formatter() {
        return {
          type: 'exemption',
          dateDélibération: vérifierDateDélibération(dateDélibération?.date).formatter(),
        };
      },
      estAvecDateÉchéance: (): this is ValueType<'avec-date-échéance'> => false,
      estExemption: (): this is ValueType<'exemption'> => true,
    }))
    .exhaustive();
};

type ConvertirEnValueTypeProps = {
  type: string;
  dateÉchéance?: string;
  dateDélibération?: string;
};

export const convertirEnValueType = ({
  type,
  dateDélibération,
  dateÉchéance,
}: ConvertirEnValueTypeProps) => {
  const typeGarantiesFinancières = TypeGarantiesFinancières.convertirEnValueType(type);
  if (dateÉchéance && !typeGarantiesFinancières.estAvecDateÉchéance()) {
    throw new DateÉchéanceNonAttendueError();
  }
  if (dateDélibération && !typeGarantiesFinancières.estExemption()) {
    throw new DateDélibérationNonAttendueError();
  }

  return match(typeGarantiesFinancières.type)
    .returnType<ValueType>()
    .with('consignation', (type) => bind({ type: { type } }))
    .with('garantie-bancaire', (type) => bind({ type: { type } }))
    .with('six-mois-après-achèvement', (type) => bind({ type: { type } }))
    .with('avec-date-échéance', (type) =>
      bind({
        type: { type },
        dateÉchéance: {
          date: vérifierDateÉchéance(dateÉchéance).formatter(),
        },
      }),
    )
    .with('exemption', (type) =>
      bind({
        type: { type },
        dateDélibération: {
          date: vérifierDateDélibération(dateDélibération).formatter(),
        },
      }),
    )
    .with('type-inconnu', () => {
      throw new TypeGarantiesFinancièresInconnu();
    })
    .exhaustive();
};

const vérifierDateÉchéance = (date: string | undefined) => {
  if (!date) {
    throw new DateÉchéanceGarantiesFinancièresRequiseError();
  }
  return DateTime.convertirEnValueType(date);
};

const vérifierDateDélibération = (date: string | undefined) => {
  if (!date) {
    throw new DateDélibérationRequiseError();
  }
  return DateTime.convertirEnValueType(date);
};

class TypeGarantiesFinancièresInconnu extends InvalidOperationError {
  constructor() {
    super('Le type de garanties financières est inconnu');
  }
}

export const estAvecDateÉchéance = (
  valueType: ValueType,
): valueType is ValueType<'avec-date-échéance'> => {
  return valueType.type.estAvecDateÉchéance();
};
