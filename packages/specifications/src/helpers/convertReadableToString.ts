import { Readable } from 'stream';

export const convertReadableToString = async (readable: Readable) => {
  const chunks: Buffer[] = [];

  readable.setEncoding('utf-8');

  for await (const chunck of readable) {
    chunks.push(Buffer.from(chunck));
  }

  return Buffer.concat(chunks).toString('utf-8');
};
