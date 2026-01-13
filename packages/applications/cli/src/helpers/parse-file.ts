import { readFile } from 'node:fs/promises';

import { z } from 'zod';
import { Flags } from '@oclif/core';

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
    const readableStream = new ReadableStream({
      start: async (controller) => {
        controller.enqueue(buffer);
        controller.close();
      },
    });
    return await ImportCSV.parseCsv(readableStream, schema, options);
  } catch (error) {
    if (error instanceof ImportCSV.CsvValidationError) {
      console.log(error.errors);
    }
    throw error;
  }
};
