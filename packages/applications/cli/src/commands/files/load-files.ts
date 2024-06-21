import fs from 'node:fs/promises';

import { z } from 'zod';

import { parseCsv } from '@potentiel-libraries/csv';

const schema = z.object({
  from: z.string(),
  to: z.string(),
});
export const loadFiles = async (path: string) => {
  const buffer = await fs.readFile(path);
  const readableStream = new ReadableStream({
    start: async (controller) => {
      controller.enqueue(buffer);
      controller.close();
    },
  });
  return await parseCsv(readableStream, schema);
};
