import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export type DateParutionCahierDesChargesModifié = '30/07/2021' | '30/08/2022' | '07/02/2023';

export const références = [
  'initial',
  '30/07/2021',
  '30/08/2022',
  '30/08/2022-alternatif',
  '07/02/2023',
  '07/02/2023-alternatif',
] as const;

export type RawType =
  | 'initial'
  | DateParutionCahierDesChargesModifié
  | `${DateParutionCahierDesChargesModifié}-alternatif`;

export type Initial = { type: 'initial' };
export type Modifié = {
  type: 'modifié';
  paruLe: DateParutionCahierDesChargesModifié;
  alternatif?: true;
};

export type ValueType = ReadonlyValueType<
  {
    formatter(): RawType;
    estCDC2022(): boolean;
    estInitial(): boolean;
  } & (Initial | Modifié)
>;

export const bind = (value: PlainType<ValueType>): ValueType => {
  if (value.type === 'initial') {
    return {
      type: 'initial',
      formatter() {
        return 'initial';
      },
      estÉgaleÀ(value: ValueType) {
        return value.type === 'initial';
      },
      estCDC2022() {
        return false;
      },
      estInitial() {
        return true;
      },
    };
  }
  return {
    type: value.type,
    paruLe: value.paruLe,
    alternatif: value.alternatif || undefined,
    formatter() {
      if (this.alternatif) {
        return `${this.paruLe}-alternatif`;
      }
      return this.paruLe;
    },
    estÉgaleÀ(value: ValueType) {
      return (
        value.type === 'modifié' &&
        value.paruLe === this.paruLe &&
        this.alternatif === (value.alternatif || undefined)
      );
    },
    estCDC2022() {
      return value.paruLe === '30/08/2022';
    },
    estInitial() {
      return false;
    },
  };
};
export const convertirEnValueType = (référence: string) => {
  estValide(référence);

  if (référence === 'initial') return bind({ type: 'initial' });
  const [paruLe, alternatif] = référence.split('-');
  return bind({
    type: 'modifié',
    paruLe: paruLe as DateParutionCahierDesChargesModifié,
    alternatif: !!alternatif || undefined,
  });
};

function estValide(value: string): asserts value is RawType {
  const isValid = (références as readonly string[]).includes(value);

  if (!isValid) {
    throw new RéférenceCahierDesChargesInvalideError(value);
  }
}

export const initial = convertirEnValueType('initial');

class RéférenceCahierDesChargesInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`La référence de cahier des charges ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
