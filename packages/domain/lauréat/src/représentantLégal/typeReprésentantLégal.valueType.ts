import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const types = [
  'personne-physique',
  'personne-morale',
  'collectivité',
  'autre',
  'inconnu',
] as const;

export type RawType = (typeof types)[number];

export type ValueType = ReadonlyValueType<{
  type: RawType;
  formatter(): RawType;
  estInconnu(): boolean;
  estPersonneMorale(): boolean;
}>;

export const bind = ({ type }: PlainType<ValueType>): ValueType => {
  estValide(type);
  return {
    type,
    estÉgaleÀ: function ({ type }) {
      return this.type === type;
    },
    formatter() {
      return this.type;
    },
    estInconnu() {
      return this.estÉgaleÀ(inconnu);
    },
    estPersonneMorale() {
      return this.estÉgaleÀ(personneMorale);
    },
  };
};

export const convertirEnValueType = (value: string) => {
  estValide(value);
  return bind({ type: value });
};

function estValide(type: string): asserts type is RawType {
  const isValid = (types as readonly string[]).includes(type);

  if (!isValid) {
    throw new TypeReprésentantLégalInvalideError(type);
  }
}

export const personnePhysique = convertirEnValueType('personne-physique');
export const personneMorale = convertirEnValueType('personne-morale');
export const collectivité = convertirEnValueType('collectivité');
export const autre = convertirEnValueType('autre');
export const inconnu = convertirEnValueType('inconnu');

class TypeReprésentantLégalInvalideError extends InvalidOperationError {
  constructor(type: string) {
    super(`Le type du représentant légal ne correspond à aucune valeur connue`, {
      type,
    });
  }
}
