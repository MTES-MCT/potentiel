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

type Typologie = (typeof typologies)[number];

export type RawType = { typologie: Typologie; détails?: string };

export type ValueType = ReadonlyValueType<{
  typologie: Typologie;
  détails?: string;
  formatter(): RawType;
}>;

export const bind = ({ typologie, détails }: PlainType<ValueType>): ValueType => {
  estValide({ typologie, détails });
  return {
    typologie,
    détails,
    formatter() {
      // TODO vérifier si on doit garde ca :)
      if (this.détails) {
        return { typologie: this.typologie, détails: this.détails };
      }
      return { typologie: this.typologie };
    },
    estÉgaleÀ({ typologie, détails }: ValueType) {
      return this.typologie === typologie && this.détails === détails;
    },
  };
};

type ConvertirEnValueTypeProps = {
  typologie: string;
  détails?: string;
};

export const convertirEnValueType = (props: ConvertirEnValueTypeProps) => {
  estValide(props);
  return bind(props);
};

function estValide(value: ConvertirEnValueTypeProps): asserts value is RawType {
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
