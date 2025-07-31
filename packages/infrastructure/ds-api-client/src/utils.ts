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

export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;
