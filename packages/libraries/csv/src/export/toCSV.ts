import { Parser, ParserOptions } from '@json2csv/plainjs';

// Utility type to extract string keys from a type
type FieldKeys<T> = T extends Array<infer U> ? keyof U : keyof T;

export type ToCSVProps<TData> = {
  data: Array<TData>;
  fields: FieldKeys<TData>[] | { label: string; value: FieldKeys<TData> }[];
  parserOptions?: Omit<ParserOptions, 'fields'>;
};

export const toCSV = async <TData extends Record<string, unknown>>({
  data,
  fields,
  parserOptions,
}: ToCSVProps<TData>) => {
  const options: ParserOptions = {
    delimiter: ';',
    withBOM: true,
    fields,
    ...parserOptions,
  };

  const csvParser = new Parser(options);
  return csvParser.parse(data);
};
