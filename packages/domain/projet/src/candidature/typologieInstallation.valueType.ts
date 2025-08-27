import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const bâtiment = [
  'bâtiment.neuf',
  'bâtiment.existant-avec-rénovation-de-toiture',
  'bâtiment.existant-sans-rénovation-de-toiture',
  'bâtiment.mixte',
] as const;

export const ombrière = ['ombrière.parking', 'ombrière.autre', 'ombrière.mixte'] as const;

export const serre = ['serre'] as const;

export const agrivoltaique = [
  'agrivoltaique.culture',
  'agrivoltaique.jachère-plus-de-5-ans',
  'agrivoltaique.élevage',
  'agrivoltaique.serre',
] as const;

export const typologies = [...bâtiment, ...ombrière, ...serre, ...agrivoltaique] as const;

export type RawType = { typologie: (typeof typologies)[number]; détails?: string };

export type ValueType = ReadonlyValueType<{
  type: RawType;
  formatter(): RawType;
}>;

export const bind = ({ type }: PlainType<ValueType>): ValueType => {
  estValide(type);
  return {
    type,
    formatter() {
      return this.type;
    },
    estÉgaleÀ(type: ValueType) {
      return this.type === type.type;
    },
  };
};

type TypeProps = {
  typologie: string;
  détails?: string;
};

export const convertirEnValueType = (type: TypeProps) => {
  estValide(type);
  return bind({ type });
};

function estValide(value: TypeProps): asserts value is RawType {
  const isValid = (typologies as readonly string[]).includes(value.typologie);

  if (!isValid) {
    throw new TypologieInstallationInvalideError(value.typologie);
  }
}

class TypologieInstallationInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`La typologie de l'installation ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
