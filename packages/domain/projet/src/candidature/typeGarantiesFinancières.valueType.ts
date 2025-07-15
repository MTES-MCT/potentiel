import { InvalidOperationError, ReadonlyValueType } from '@potentiel-domain/core';

export const types = [
  'consignation',
  'avec-date-échéance',
  'six-mois-après-achèvement',
  'type-inconnu',
  'garantie-bancaire',
] as const;

export type RawType = (typeof types)[number];

export type ValueType = ReadonlyValueType<{
  type: RawType;
  estGarantieBancaire: () => boolean;
  estConsignation: () => boolean;
  estAvecDateÉchéance: () => boolean;
  estSixMoisAprèsAchèvement: () => boolean;
  estInconnu: () => boolean;
}>;

export const convertirEnValueType = (value: string): ValueType => {
  estValide(value);
  return {
    get type() {
      return value;
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
    estInconnu() {
      return this.type === 'type-inconnu';
    },
  };
};

function estValide(value: string): asserts value is RawType {
  const isValid = types.includes(value as RawType);

  if (!isValid) {
    throw new TypeGarantiesFinancièresInvalideError(value);
  }
}

export const consignation = convertirEnValueType('consignation');
export const avecDateÉchéance = convertirEnValueType('avec-date-échéance');
export const sixMoisAprèsAchèvement = convertirEnValueType('six-mois-après-achèvement');
export const garantieBancaire = convertirEnValueType('garantie-bancaire');
export const typeInconnu = convertirEnValueType('type-inconnu');

class TypeGarantiesFinancièresInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le type ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
