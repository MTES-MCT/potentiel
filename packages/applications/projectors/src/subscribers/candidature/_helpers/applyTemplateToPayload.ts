type TemplateContext = {
  appelOffre?: string;
  typeImport?: string;
};

type TemplateLabel = [TemplateContext, string];

export type Template<T> = {
  [K in keyof T]:
    | {
        labels: TemplateLabel[];
        mapper: (value: string) => T[K];
      }
    | undefined;
};

const matchesContext = (conditions: Partial<TemplateContext>, context: TemplateContext): boolean =>
  (conditions.appelOffre === undefined || conditions.appelOffre === context.appelOffre) &&
  (conditions.typeImport === undefined || conditions.typeImport === context.typeImport);

export const applyTemplateToPayload = <T>(
  payload: Record<string, string>,
  template: Template<T>,
  context: TemplateContext,
): T => {
  const result = {} as T;

  const keys = Object.keys(template) as Array<keyof T>;

  for (const key of keys) {
    const field = template[key];

    if (!field) {
      result[key] = undefined as T[keyof T];
      continue;
    }

    const { labels, mapper } = field;

    const matchingLabel = labels.find(([conditions]) => matchesContext(conditions, context))?.[1];

    if (!matchingLabel) {
      result[key] = undefined as T[keyof T];
      continue;
    }

    const value = payload[matchingLabel];

    result[key] = mapper(value);
  }

  return result;
};
