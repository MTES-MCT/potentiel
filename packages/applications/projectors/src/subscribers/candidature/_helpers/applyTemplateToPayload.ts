import { match } from 'ts-pattern';

import type { AppelOffre } from '@potentiel-domain/appel-offre';

type Props = {
  appelOffre: string;
  typeImport: AppelOffre.Periode['typeImport'];
};

type Field<T, K extends keyof T = keyof T> = {
  label: Array<[Partial<Props>, string]>;
  mapper: (value: string | undefined, props: Props) => T[K];
};

export type Template<T> = {
  [K in keyof T]: Template<T[K]> | Field<T>;
};

export const getLabel = (labelOptions: Array<[Partial<Props>, string]>, props: Props) => {
  let matcher = match(props).returnType<string | undefined>();

  for (const [condition, label] of labelOptions) {
    matcher = matcher.with(condition as Partial<Props>, () => label);
  }

  return matcher.otherwise(() => undefined);
};

const isField = <T>(node: Template<T> | Field<T>): node is Field<T> => {
  return 'label' in node && 'mapper' in node;
};

export const applyTemplateToPayload = <T>(
  payload: Record<string, string>,
  template: Template<T>,
  props: Props,
): T => {
  const result = {} as T;

  for (const key of Object.keys(template) as Array<keyof T>) {
    const node = template[key] as Template<T> | Field<T>;

    if (isField(node)) {
      const label = getLabel(node.label, props);

      result[key] = node.mapper(label ? payload[label] : undefined, props);
    } else {
      result[key] = applyTemplateToPayload(payload, node, props) as T[keyof T];
    }
  }

  return result;
};
