import { getSearchParamsEnumValue } from './getSearchParamsEnumValue';
import { getSearchParamsMultipleValues } from './getSearchParamsMultipleValues';
import { getSearchParamsSingleValue } from './getSearchParamsSingleValue';

type SearchParamsConfig = Record<string, 'single' | 'multiple' | readonly string[]>;

type SearchParamsValues<TConfig extends SearchParamsConfig> = {
  [TKey in keyof TConfig]: TConfig[TKey] extends readonly string[]
    ? TConfig[TKey][number] | undefined
    : TConfig[TKey] extends 'multiple'
      ? Array<string> | undefined
      : string | undefined;
};

type GetSearchParamsValuesProps<TConfig extends SearchParamsConfig> = {
  searchParams: URLSearchParams;
  config: TConfig;
};

export const getSearchParamsValues = <TConfig extends SearchParamsConfig>({
  searchParams,
  config,
}: GetSearchParamsValuesProps<TConfig>): SearchParamsValues<TConfig> => {
  const values = {} as SearchParamsValues<TConfig>;

  for (const name of Object.keys(config) as Array<keyof TConfig & string>) {
    const paramConfig = config[name];

    const value = Array.isArray(paramConfig)
      ? getSearchParamsEnumValue(searchParams, name, paramConfig)
      : paramConfig === 'multiple'
        ? getSearchParamsMultipleValues(searchParams, name)
        : getSearchParamsSingleValue(searchParams, name);

    values[name] = value as SearchParamsValues<TConfig>[typeof name];
  }

  return values;
};
