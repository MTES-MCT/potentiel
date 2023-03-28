export type KeyValuePair<TCategory extends string, TValue> = {
  key: `${TCategory}#${string}`;
  value: Omit<TValue, 'type'>;
};
