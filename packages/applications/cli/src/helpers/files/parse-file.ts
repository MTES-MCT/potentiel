import { readFile } from 'node:fs/promises';
import { Readable } from 'node:stream';

import { Flags } from '@oclif/core';
import type { z } from 'zod';

import { ImportCSV } from '@potentiel-libraries/csv';

export const csvFlags = {
  delimiter: Flags.string({
    options: [',', ';'] as const,
    default: ';',
  }),
  encoding: Flags.option({
    options: ['utf8', 'win1252'] as const,
    default: 'win1252' as const,
  })(),
};

export const parseCsvFile = async <T extends z.ZodRawShape>(
  path: string,
  schema: z.ZodObject<T>,
  options?: Partial<ImportCSV.ParseOptions>,
) => {
  try {
    const buffer = await readFile(path);
    const readableStream = Readable.toWeb(Readable.from(buffer));
    return await ImportCSV.fromCSV(readableStream, schema, options);
  } catch (error) {
    if (error instanceof ImportCSV.CsvLineValidationError) {
      console.log(error.errors);
    }
    throw error;
  }
};
