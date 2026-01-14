import { Parser, ParserOptions } from '@json2csv/plainjs';

export type ToCSVProps<TData> = {
  data: TData;
  /**
   * TODO : fields type should be improved to match TData structure :
   * (Array<keyof TData | { label: string; default?: value: keyofTData; value: keyof TData }>).
   */
  fields: ParserOptions['fields'];
  parserOptions?: Omit<ParserOptions, 'fields'>;
};

export const toCSV = async <TData extends object | Array<object>>({
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
