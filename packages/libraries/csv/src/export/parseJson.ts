import { Parser, ParserOptions } from '@json2csv/plainjs';

export type ParseJsonProps<TData> = {
  data: TData;
  fields: ParserOptions['fields'];
  parserOptions?: Omit<ParserOptions, 'fields'>;
};

export const parseJson = async <TData extends object | Array<object>>({
  data,
  fields,
  parserOptions,
}: ParseJsonProps<TData>) => {
  const defaultOptions: ParserOptions = {
    fields,
    delimiter: ';',
    withBOM: true,
  };

  const options = { ...defaultOptions, ...parserOptions };

  const csvParser = new Parser(options);

  return csvParser.parse(data);
};
