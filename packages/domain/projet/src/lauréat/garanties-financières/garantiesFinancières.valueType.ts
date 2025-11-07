import { match } from 'ts-pattern';

import { DateTime } from '@potentiel-domain/common';
import { PlainType, ReadonlyValueType } from '@potentiel-domain/core';

import { TypeGarantiesFinancières } from '../../candidature';

import {
  DateÉchéanceGarantiesFinancièresRequiseError,
  DateÉchéanceNonAttendueError,
} from './garantiesFinancières.error';

export type RawType = (
  | {
      type: 'type-inconnu' | 'consignation' | 'six-mois-après-achèvement' | 'exemption';
    }
  | {
      type: 'avec-date-échéance';
      dateÉchéance: DateTime.RawType;
    }
) & {
  constitution: { attestation: { format: string }; date: DateTime.RawType } | undefined;
};

type ConstitutionValueType = { attestation: { format: string }; date: DateTime.ValueType };

type InconnuValueType = {
  type: TypeGarantiesFinancières.ValueType<'type-inconnu'>;
  constitution: ConstitutionValueType | undefined;
};

type ConsignationValueType = {
  type: TypeGarantiesFinancières.ValueType<'consignation'>;
  constitution: ConstitutionValueType | undefined;
};

type SixMoisAprèsAchèvementValueType = {
  type: TypeGarantiesFinancières.ValueType<'six-mois-après-achèvement'>;
  constitution: ConstitutionValueType | undefined;
};
type ExemptionValueType = {
  type: TypeGarantiesFinancières.ValueType<'exemption'>;
  constitution: ConstitutionValueType | undefined;
};
type AvecDateÉchéanceValueType = {
  type: TypeGarantiesFinancières.ValueType<'avec-date-échéance'>;
  dateÉchéance: DateTime.ValueType;
  constitution: ConstitutionValueType | undefined;
};

export type ValueType<
  Type extends TypeGarantiesFinancières.RawType = TypeGarantiesFinancières.RawType,
> = ReadonlyValueType<
  (
    | (Type extends 'consignation' ? ConsignationValueType : never)
    | (Type extends 'six-mois-après-achèvement' ? SixMoisAprèsAchèvementValueType : never)
    | (Type extends 'avec-date-échéance' ? AvecDateÉchéanceValueType : never)
    | (Type extends 'exemption' ? ExemptionValueType : never)
    | (Type extends 'type-inconnu' ? InconnuValueType : never)
  ) & {
    formatter(): RawType;
    estAvecDateÉchéance(): this is ValueType<'avec-date-échéance'>;
    estExemption(): this is ValueType<'exemption'>;
    estConstitué(): this is ValueType & {
      constitution: ConsignationValueType;
    };
  }
>;

export const bind = (plain: PlainType<ValueType>): ValueType => {
  const constitution: ValueType['constitution'] = plain.constitution && {
    attestation: { format: plain.constitution.attestation.format },
    date: DateTime.convertirEnValueType(plain.constitution.date.date),
  };
  const common = {
    estConstitué(): this is ValueType & {
      constitution: ConsignationValueType;
    } {
      return (
        typeof plain.constitution?.attestation.format === 'string' &&
        typeof plain.constitution.date.date === 'string'
      );
    },
    constitution,
  };
  return match(plain)
    .returnType<ValueType>()
    .with({ type: { type: 'type-inconnu' } }, ({ constitution }) => ({
      type: TypeGarantiesFinancières.typeInconnu,
      estÉgaleÀ: (valueType: ValueType) => {
        const raw = valueType.formatter();
        return (
          raw.type === 'type-inconnu' &&
          raw.constitution?.attestation.format === constitution?.attestation.format &&
          raw.constitution?.date === constitution?.date.date
        );
      },
      formatter: () => ({
        type: 'type-inconnu',
        constitution: constitution
          ? {
              attestation: { format: constitution?.attestation.format },
              date: constitution?.date.date,
            }
          : undefined,
      }),
      estAvecDateÉchéance: (): this is ValueType<'avec-date-échéance'> => false,
      estExemption: (): this is ValueType<'exemption'> => false,
      ...common,
    }))
    .with({ type: { type: 'consignation' } }, ({ constitution }) => ({
      type: TypeGarantiesFinancières.consignation,
      estÉgaleÀ: (valueType: ValueType) => {
        const raw = valueType.formatter();
        return (
          raw.type === 'consignation' &&
          raw.constitution?.attestation.format === constitution?.attestation.format &&
          raw.constitution?.date === constitution?.date.date
        );
      },
      formatter: () => ({
        type: 'consignation',
        constitution: constitution
          ? {
              attestation: { format: constitution?.attestation.format },
              date: constitution?.date.date,
            }
          : undefined,
      }),
      estAvecDateÉchéance: (): this is ValueType<'avec-date-échéance'> => false,
      estExemption: (): this is ValueType<'exemption'> => false,
      ...common,
    }))
    .with({ type: { type: 'six-mois-après-achèvement' } }, ({ constitution }) => ({
      type: TypeGarantiesFinancières.sixMoisAprèsAchèvement,
      estÉgaleÀ: (valueType: ValueType) => {
        const raw = valueType.formatter();
        return (
          raw.type === 'six-mois-après-achèvement' &&
          raw.constitution?.attestation.format === constitution?.attestation.format &&
          raw.constitution?.date === constitution?.date.date
        );
      },
      formatter: () => ({
        type: 'six-mois-après-achèvement',
        constitution: constitution
          ? {
              attestation: { format: constitution?.attestation.format },
              date: constitution?.date.date,
            }
          : undefined,
      }),
      estAvecDateÉchéance: (): this is ValueType<'avec-date-échéance'> => false,
      estExemption: (): this is ValueType<'exemption'> => false,
      ...common,
    }))
    .with({ type: { type: 'exemption' } }, ({ constitution }) => ({
      type: TypeGarantiesFinancières.exemption,
      estÉgaleÀ: (valueType: ValueType) => {
        const raw = valueType.formatter();
        return (
          raw.type === 'exemption' &&
          raw.constitution?.attestation.format === constitution?.attestation.format &&
          raw.constitution?.date === constitution?.date.date
        );
      },
      formatter: () => ({
        type: 'exemption',
        constitution: constitution
          ? {
              attestation: { format: constitution?.attestation.format },
              date: constitution?.date.date,
            }
          : undefined,
      }),
      estAvecDateÉchéance: (): this is ValueType<'avec-date-échéance'> => false,
      estExemption: (): this is ValueType<'exemption'> => true,
      ...common,
    }))
    .with({ type: { type: 'avec-date-échéance' } }, ({ dateÉchéance, constitution }) => {
      const dateÉchéanceValueType = vérifierDateÉchéance(dateÉchéance?.date);
      return {
        type: TypeGarantiesFinancières.avecDateÉchéance,
        dateÉchéance: dateÉchéanceValueType,
        estÉgaleÀ(valueType: ValueType) {
          const raw = valueType.formatter();
          return (
            raw.type === 'avec-date-échéance' &&
            raw.dateÉchéance === dateÉchéanceValueType.formatter() &&
            raw.constitution?.attestation.format === constitution?.attestation.format &&
            raw.constitution?.date === constitution?.date.date
          );
        },
        formatter() {
          return {
            type: 'avec-date-échéance',
            dateÉchéance: dateÉchéanceValueType.formatter(),
            constitution: constitution
              ? {
                  attestation: { format: constitution?.attestation.format },
                  date: constitution?.date.date,
                }
              : undefined,
          };
        },
        estAvecDateÉchéance: (): this is ValueType<'avec-date-échéance'> => true,
        estExemption: (): this is ValueType<'exemption'> => false,
        ...common,
      };
    })
    .exhaustive();
};

type ConvertirEnValueTypeProps = {
  type: string;
  dateÉchéance: string | undefined;
  attestation: { format: string } | undefined;
  dateConstitution: string | undefined;
};

export const convertirEnValueType = ({
  type,
  dateÉchéance,
  attestation,
  dateConstitution,
}: ConvertirEnValueTypeProps) => {
  const typeGarantiesFinancières = TypeGarantiesFinancières.convertirEnValueType(type);

  if (dateÉchéance && !typeGarantiesFinancières.estAvecDateÉchéance()) {
    throw new DateÉchéanceNonAttendueError();
  }

  const constitutionPlainType =
    attestation && dateConstitution
      ? {
          attestation: { format: attestation.format },
          date: { date: DateTime.convertirEnValueType(dateConstitution).formatter() },
        }
      : undefined;

  return match(typeGarantiesFinancières.type)
    .returnType<ValueType>()
    .with('type-inconnu', (type) =>
      bind({
        type: { type },
        constitution: constitutionPlainType,
      }),
    )
    .with('consignation', (type) => bind({ type: { type }, constitution: constitutionPlainType }))
    .with('six-mois-après-achèvement', (type) =>
      bind({ type: { type }, constitution: constitutionPlainType }),
    )
    .with('exemption', (type) => bind({ type: { type }, constitution: constitutionPlainType }))
    .with('avec-date-échéance', (type) =>
      bind({
        type: { type },
        dateÉchéance: {
          date: vérifierDateÉchéance(dateÉchéance).formatter(),
        },
        constitution: constitutionPlainType,
      }),
    )
    .exhaustive();
};

const vérifierDateÉchéance = (date: string | undefined) => {
  if (!date) {
    throw new DateÉchéanceGarantiesFinancièresRequiseError();
  }
  return DateTime.convertirEnValueType(date);
};
