import { DateTime } from '@potentiel-domain/common';

/** map qui décrit comment sont représentés les champs dans les exemples des spécifications */
export type FieldToExempleMapper<TMap extends Record<string, unknown>> = {
  [FieldName in keyof TMap]: TMap[FieldName] extends string | undefined
    ? [exempleName: string, transformer?: (value: string) => TMap[FieldName] | undefined]
    : [exempleName: string, transformer: (value: string) => TMap[FieldName] | undefined];
};

/**
 * Convertit les valeurs de l'exemple dans les specs, en un objet utilisable dans le code, selon le mapping décrit par `map`
 *
 * @example
 * ```ts
 * const { foo, bar } = mapToExemple(dataTable.rowsHash(), {
 *   foo: ["nom du champs utilisé dans les specs"], // pas besoin de transformation pour un string
 *   bar: ["nom du champs 2", mapNumber], // transformation du champ en nombre
 * });
 * ```
 **/
export const mapToExemple = <TMap extends Record<string, unknown>>(
  exemple: Record<string, string>,
  map: FieldToExempleMapper<TMap>,
): Partial<TMap> => {
  const exempleToFieldName = Object.fromEntries(
    Object.entries(map).map(([field, [exempleName]]) => [exempleName, field]),
  );
  const fieldNameToTransformFunc = Object.fromEntries(
    Object.entries(map).map(([field, [, transform]]) => [field, transform]),
  ) as {
    [P in keyof TMap]: ((value: string) => TMap[P] | undefined) | undefined;
  };

  return Object.entries(exemple).reduce(
    (prev, [exempleName, value]) => {
      const fieldName = exempleToFieldName[exempleName];
      if (!fieldName) return prev;
      const transformer = fieldNameToTransformFunc[fieldName]!;
      prev[fieldName] = transformer ? transformer(value) : value;
      return prev;
    },
    {} as Record<string, unknown>,
  ) as Partial<TMap>;
};

export const mapBoolean = (val: string) => (val ? val === 'oui' : undefined);
export const mapOptionalBoolean = (val: string) =>
  val === 'oui' ? true : val === 'non' ? false : undefined;
export const mapNumber = (val: string) => (val ? Number(val) : undefined);
export const mapDateTime = (val: string) =>
  val ? DateTime.convertirEnValueType(new Date(val)).formatter() : undefined;
export const mapValueType =
  <TValueType extends { formatter(): TRaw }, TRaw extends string>(
    convertirEnValueType: (val: string) => TValueType,
  ) =>
  (val: string): TRaw | undefined =>
    val ? convertirEnValueType(val).formatter() : undefined;
