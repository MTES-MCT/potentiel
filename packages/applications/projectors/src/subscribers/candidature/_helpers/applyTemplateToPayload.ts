import { match } from 'ts-pattern';

import type { AppelOffre } from '@potentiel-domain/appel-offre';

type Props = {
  appelOffre: string;
  typeImport: AppelOffre.Periode['typeImport'];
};

type Field<T> = {
  type: 'field';
  label: Array<[Partial<Props>, string]>;
  mapper: (value: string | undefined, props: Props) => T;
};

type Group<T> = {
  type: 'group';
  fields: Template<T>;
};

export type Template<T> = {
  [K in keyof T]: TemplateNode<T[K]>;
};

type TemplateNode<T> = NonNullable<T> extends object ? Group<NonNullable<T>> | Field<T> : Field<T>;

export const getLabel = (labelOptions: Array<[Partial<Props>, string]>, props: Props) => {
  let matcher = match(props).returnType<string | undefined>();

  for (const [condition, label] of labelOptions) {
    matcher = matcher.with(condition as Partial<Props>, () => label);
  }

  return matcher.otherwise(() => undefined);
};

export const applyTemplateToPayload = <T>(
  payload: Record<string, string>,
  template: Template<T>,
  props: Props,
): T => {
  const result = {} as T;

  for (const key of Object.keys(template) as Array<keyof T>) {
    const node = template[key];

    if (node.type === 'group') {
      result[key] = applyTemplateToPayload(payload, node.fields, props) as T[keyof T];

      continue;
    }

    const label = getLabel(node.label, props);

    result[key] = node.mapper(label ? payload[label] : undefined, props) as T[keyof T];
  }

  return result;
};
