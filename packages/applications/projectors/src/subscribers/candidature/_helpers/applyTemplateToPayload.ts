export type Template<T> = {
  [K in keyof T]:
    | {
        label: string;
        mapper: (value: string) => T[K];
      }
    | undefined;
};

export const applyTemplateToPayload = <T>(
  payload: Record<string, string>,
  template: Template<T>,
): T => {
  const result = {} as T;

  const keys = Object.keys(template) as Array<keyof T>;

  for (const key of keys) {
    const field = template[key];

    if (!field) {
      continue;
    }

    const { label, mapper } = field;
    const value = payload[label];

    result[key] = mapper(value);
  }

  return result;
};
