import { readFile } from 'node:fs/promises';

import { z } from 'zod';

import { CsvValidationError, parseCsv, ParseOptions } from '@potentiel-libraries/csv';

export const parseCsvFile = async <T extends z.ZodRawShape>(
  path: string,
  schema: z.ZodObject<T>,
  options?: Partial<ParseOptions>,
) => {
  try {
    const buffer = await readFile(path);
    const readableStream = new ReadableStream({
      start: async (controller) => {
        controller.enqueue(buffer);
        controller.close();
      },
    });
    return await parseCsv(readableStream, schema, options);
  } catch (error) {
    if (error instanceof CsvValidationError) {
      console.log(error.errors);
    }
    throw error;
  }
};
