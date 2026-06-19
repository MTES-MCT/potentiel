import { match } from 'ts-pattern';

import type { AppelOffre } from '@potentiel-domain/appel-offre';

type Props = {
  appelOffre: string;
  typeImport: AppelOffre.Periode['typeImport'];
};

export type Template<T> = {
  [K in keyof T]:
    | {
        label: Array<[Partial<Props>, string]>;
        mapper: (value: string, props: Props) => T[K];
      }
    | undefined;
};

export const applyTemplateToPayload = <T>(
  payload: Record<string, string>,
  template: Template<T>,
  props: Props,
): T => {
  const result = {} as T;

  const keys = Object.keys(template) as Array<keyof T>;

  for (const key of keys) {
    const field = template[key];

    if (!field) {
      result[key] = undefined as T[keyof T];
      continue;
    }

    const { label: labelOptions, mapper } = field;

    let matcher = match<Props>(props).returnType<string | undefined>();
    for (const [matchCondition, labelValue] of labelOptions) {
      matcher = matcher.with(matchCondition, () => labelValue);
    }
    const label = matcher.otherwise(() => undefined);
    result[key] = label ? mapper(payload[label], props) : (undefined as T[keyof T]);
  }

  return result;
};
