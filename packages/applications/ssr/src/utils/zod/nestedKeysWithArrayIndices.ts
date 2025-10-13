export type NestedKeysWithArrayIndices<T> = T extends (infer U)[]
  ? // Si T est un tableau → on ajoute un index numérique générique
    `${number}` | `${number}.${NestedKeysWithArrayIndices<U>}`
  : T extends object
    ? {
        [K in keyof T & string]: T[K] extends (infer U)[]
          ? // Si la propriété est un tableau
            `${K}` | `${K}.${number}` | `${K}.${number}.${NestedKeysWithArrayIndices<U>}`
          : // Si la propriété est un objet
            T[K] extends object | undefined
            ? `${K}` | `${K}.${NestedKeysWithArrayIndices<NonNullable<T[K]>>}`
            : // Sinon clé simple
              `${K}`;
      }[keyof T & string]
    : never;
