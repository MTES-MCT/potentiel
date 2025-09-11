import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const types = [
  'consignation',
  'avec-date-échéance',
  'six-mois-après-achèvement',
  'type-inconnu',
  'garantie-bancaire',
  'exemption',
] as const;

export type RawType = (typeof types)[number];

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  type: Type;
  estGarantieBancaire: () => boolean;
  estConsignation: () => boolean;
  estAvecDateÉchéance: () => boolean;
  estSixMoisAprèsAchèvement: () => boolean;
  estExemption: () => boolean;
  estInconnu: () => boolean;
  formatter(): Type;
}>;

export const bind = <Type extends RawType = RawType>({
  type,
}: PlainType<ValueType>): ValueType<Type> => {
  estValide(type);
  return {
    get type() {
      return type as Type;
    },
    estÉgaleÀ(valueType) {
      return this.type === valueType.type;
    },
    estGarantieBancaire() {
      return this.type === 'garantie-bancaire';
    },
    estConsignation() {
      return this.type === 'consignation';
    },
    estAvecDateÉchéance() {
      return this.type === 'avec-date-échéance';
    },
    estSixMoisAprèsAchèvement() {
      return this.type === 'six-mois-après-achèvement';
    },
    estExemption() {
      return this.type === 'exemption';
    },
    estInconnu() {
      return this.type === 'type-inconnu';
    },
    formatter() {
      return this.type;
    },
  };
};

export const convertirEnValueType = <Type extends RawType = RawType>(type: string) => {
  estValide(type);
  return bind<Type>({ type });
};

function estValide(value: string): asserts value is RawType {
  const isValid = types.includes(value as RawType);

  if (!isValid) {
    throw new TypeGarantiesFinancièresInvalideError(value);
  }
}

export const consignation = convertirEnValueType<'consignation'>('consignation');
export const avecDateÉchéance = convertirEnValueType<'avec-date-échéance'>('avec-date-échéance');
export const sixMoisAprèsAchèvement = convertirEnValueType<'six-mois-après-achèvement'>(
  'six-mois-après-achèvement',
);
export const garantieBancaire = convertirEnValueType<'garantie-bancaire'>('garantie-bancaire');
export const exemption = convertirEnValueType<'exemption'>('exemption');
export const typeInconnu = convertirEnValueType<'type-inconnu'>('type-inconnu');

class TypeGarantiesFinancièresInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
