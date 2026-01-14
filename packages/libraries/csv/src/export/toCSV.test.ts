import { test } from 'node:test';
// Import Readable from Node.js

import { z } from 'zod';
import { expect } from 'chai';

import { fromCSV } from '../import';

import { toCSV } from './toCSV';

test(`Étant donné des données à exporter en CSV
  Quand on transforme les données en CSV
  Alors le contenu du CSV doit correspondre au contenu transformé`, async () => {
  const data = [
    {
      props1: 'A',
      props2: 'B',
    },
    {
      props1: 'C',
      props2: 'D',
    },
  ];

  const fields = ['props1', 'props2'];

  const csv = await toCSV({ data, fields });

  const schema = z.object({
    props1: z.string(),
    props2: z.string(),
  });

  // Use Readable.from to create a readable stream from the CSV string

  const readableStream = convertStringToReadableStream(csv);

  const { parsedData } = await fromCSV(readableStream, schema);
  expect(parsedData).to.deep.eq(data);
});

const convertStringToReadableStream = (value: string) => {
  const content = new ReadableStream({
    start: async (controller) => {
      controller.enqueue(Buffer.from(value, 'utf-8'));
      controller.close();
    },
  });

  return content;
};
