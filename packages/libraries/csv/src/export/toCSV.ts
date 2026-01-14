import { Parser, ParserOptions } from '@json2csv/plainjs';

// Utility type to extract string keys from a type
type StringKeys<T> = Extract<keyof T, string>;

export type ToCSVProps<TData extends object> = {
  data: TData | Array<TData>;
  fields: Array<StringKeys<TData> | { label: string; value: StringKeys<TData> }>;
  parserOptions?: Omit<ParserOptions, 'fields'>;
};

export const toCSV = async <TData extends object>({
  data,
  fields,
  parserOptions,
}: ToCSVProps<TData>) => {
  const defaultOptions: ParserOptions = {
    fields,
    delimiter: ';',
    withBOM: true,
  };

  const options = { ...defaultOptions, ...parserOptions };

  const csvParser = new Parser(options);
  return csvParser.parse(data);
};
