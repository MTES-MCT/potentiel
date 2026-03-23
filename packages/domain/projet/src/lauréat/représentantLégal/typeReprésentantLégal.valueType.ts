import { InvalidOperationError, PlainType, ReadonlyValueType } from '@potentiel-domain/core';

export const types = [
  'personne-physique',
  'personne-morale',
  'collectivité',
  'autre',
  'inconnu',
] as const;

export type RawType = (typeof types)[number];

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  type: Type;
  formatter(): Type;
  estInconnu(): boolean;
}>;

export const bind = <Type extends RawType = RawType>({
  type,
}: PlainType<ValueType>): ValueType<Type> => {
  estValide(type);
  return {
    get type() {
      return type as Type;
    },
    estÉgaleÀ({ type }) {
      return this.type === type;
    },
    formatter() {
      return this.type;
    },
    estInconnu() {
      return this.type === 'inconnu';
    },
  };
};

export const convertirEnValueType = <Type extends RawType = RawType>(value: string) => {
  estValide(value);
  return bind<Type>({ type: value });
};

function estValide(type: string): asserts type is RawType {
  const isValid = (types as readonly string[]).includes(type);

  if (!isValid) {
    throw new TypeReprésentantLégalInvalideError(type);
  }
}

export const personnePhysique = convertirEnValueType<'personne-physique'>('personne-physique');
export const personneMorale = convertirEnValueType<'personne-morale'>('personne-morale');
export const collectivité = convertirEnValueType<'collectivité'>('collectivité');
export const autre = convertirEnValueType<'autre'>('autre');
export const inconnu = convertirEnValueType<'inconnu'>('inconnu');

class TypeReprésentantLégalInvalideError extends InvalidOperationError {
  constructor(type: string) {
    super(`Le type du représentant légal ne correspond à aucune valeur connue`, {
      type,
    });
  }
}
