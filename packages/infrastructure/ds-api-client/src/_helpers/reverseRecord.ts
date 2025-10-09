/**
 * Transforme un Record<T,U> en Record<U,T>
 * Concrètement, l'utilité est de pouvoir typer fortement une map de facon à n'oublier aucune clé T
 */
export const reverseRecord = <T extends string, U extends string>(
  record: Record<T, U>,
): Record<U, T> => {
  const reversed = {} as Record<U, T>;
  for (const key in record) {
    const value = record[key];
    reversed[value] = key;
  }
  return reversed;
};
