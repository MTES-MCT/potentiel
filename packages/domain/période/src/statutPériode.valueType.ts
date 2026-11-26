import {
  InvalidOperationError,
  type PlainType,
  type ReadonlyValueType,
} from '@potentiel-domain/core';

export const statuts = ['en-attente-d-import', 'import-initié', 'importée', 'notifiée'] as const;

export type RawType = (typeof statuts)[number];

export type ValueType<Type extends RawType = RawType> = ReadonlyValueType<{
  statut: Type;
  formatter(): Type;
  estEnAttenteDImport(): boolean;
  estImportInitié(): boolean;
  estImportée(): boolean;
  estNotifiée(): boolean;
}>;

export const bind = <Type extends RawType = RawType>({
  statut,
}: PlainType<ValueType>): ValueType<Type> => {
  estValide(statut);
  return {
    get statut() {
      return statut as Type;
    },
    estÉgaleÀ({ statut }) {
      return this.statut === statut;
    },
    formatter() {
      return this.statut;
    },
    estEnAttenteDImport() {
      return this.statut === 'en-attente-d-import';
    },
    estImportInitié() {
      return this.statut === 'import-initié';
    },
    estImportée() {
      return this.statut === 'importée';
    },
    estNotifiée() {
      return this.statut === 'notifiée';
    },
  };
};

export const convertirEnValueType = <Type extends RawType = RawType>(statut: string) => {
  estValide(statut);
  return bind<Type>({ statut });
};

function estValide(value: string): asserts value is RawType {
  const isValid = (statuts as readonly string[]).includes(value);

  if (!isValid) {
    throw new StatutPériodeInvalideError(value);
  }
}

export const enAttenteDImport = convertirEnValueType<'en-attente-d-import'>('en-attente-d-import');
export const importInitié = convertirEnValueType<'import-initié'>('import-initié');
export const importée = convertirEnValueType<'importée'>('importée');
export const notifiée = convertirEnValueType<'notifiée'>('notifiée');

class StatutPériodeInvalideError extends InvalidOperationError {
  constructor(value: string) {
    super(`Le statut de la période ne correspond à aucune valeur connue`, {
      value,
    });
  }
}
